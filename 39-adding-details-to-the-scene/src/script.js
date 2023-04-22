import './style.css';
import * as dat from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import firefliesVertexShader from './shaders/fireflies/VertexShader.glsl';
import firefliesFragmentShader from './shaders/fireflies/FragmentShader.glsl';
import portalVertexShader from './shaders/portal/VertexShader.glsl';
import portalFragmentShader from './shaders/portal/FragmentShader.glsl';

/***   Base   ***/
// Debug
const gui = new dat.GUI({ width: 300 });
const basicSettings = gui.addFolder('Basic Settings'); 
const firefliesSettings = gui.addFolder('Fireflies');
const portalSettings = gui.addFolder('Portal');
const debug = { clearColor: '#201919' };
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();

/***   Loaders   ***/
// Texture loader
const textureLoader = new THREE.TextureLoader();
// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');
// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/***   Textures   ***/
const bakedTexture = textureLoader.load('baked.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

/***   Materials   ***/
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
// Portal material
const portalMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color(0x000000), },
    uColorEnd: { value: new THREE.Color(0xffffff), },
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
});
portalSettings.addColor(portalMaterial.uniforms.uColorStart, 'value').name('inner color');
portalSettings.addColor(portalMaterial.uniforms.uColorEnd, 'value').name('outer color');

/***   Model   ***/
gltfLoader.load('portal-merged.glb', (gltf) => {
  const bakedMesh = gltf.scene.children.find(({ name }) => name === 'Baked'),
    poleLights = gltf.scene.children.filter(({ name }) => name.includes('LampGlass')),
    portal = gltf.scene.children.find(({ name }) => name === 'Portal');
  bakedMesh.material = bakedMaterial;
  for (const light of poleLights) light.material = poleLightMaterial;
  portal.material = portalMaterial;
  scene.add(gltf.scene);
});

/***   Fireflies   ***/
// Geometry
const firefliesGeometry = new THREE.BufferGeometry(),
  firefliesCount = 30,
  positionArray = new Float32Array({ length: firefliesCount * 3 }),
  scaleArray = new Float32Array({ length: firefliesCount });
for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = (Math.random() - 0.0) * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
  scaleArray[i] = Math.random();
}
firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));
// Material
const firefliesMaterial = new THREE.ShaderMaterial({
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2), },
    uSize: { value: 250, },
  },
  transparent: true,
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  depthWrite: false,
});
firefliesSettings.add(firefliesMaterial.uniforms.uSize, 'value', 1, 500, 1).name('fireflies size');
// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

/***   Sizes   ***/
const sizes = { width: window.innerWidth, height: window.innerHeight };
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
});

/***   Camera   ***/
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 2, 4);
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/***   Renderer   ***/
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(debug.clearColor);
basicSettings.addColor(debug, 'clearColor').name('clear color').onChange((val) => { renderer.setClearColor(val); });

/***   Utils   ***/
// Animate
const clock = new THREE.Clock();
(function tick() {
  const elapsedTime = clock.getElapsedTime();
  // Update materials
  firefliesMaterial.uniforms.uTime.value = elapsedTime;
  portalMaterial.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
})();