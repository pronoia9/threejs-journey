import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

const progressBar = document.querySelector('.progress-bar');

/***   Loaders   ***/
const loadingManager = new THREE.LoadingManager(
  () => {
    console.log('Loading complete!');
    setTimeout(() => {
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 });
      progressBar.classList.add('ended');
      progressBar.style.transform = '';
    }, 500);
  },
  (url, itemsLoaded, itemsTotal) => {
    // console.log(`Loading file: ${url.split('/').pop()}\nLoaded ${itemsLoaded}/${itemsTotal} files.`);
    progressBar.style.transform = `scaleX(${itemsLoaded / itemsTotal})`;
  },
  (url) => {
    console.log('There was an error loading ' + url);
  }
);
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

/***   Base   ***/
// Debug
const debug = { envMap: 0, envMapIntensity: 2.5 };
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();

/***   Environment map   ***/
const environmentMaps = Array.from({ length: 1 }, (v, i) =>
  cubeTextureLoader.load(
    Array.from({ length: 6 }, (v, j) => `/textures/environmentMaps/${i}/${['px', 'nx', 'py', 'ny', 'pz', 'nz'][j]}.jpg`)
  )
);
environmentMaps[debug.envMap].encoding = THREE.sRGBEncoding;
scene.background = environmentMaps[debug.envMap];
scene.environment = environmentMaps[debug.envMap];

/***   Models   ***/
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);
  updateAllMaterials();
});

/***   Lights   ***/
const directionalLight = new THREE.DirectionalLight('#fff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

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
});

/***   Overlay   ***/
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: { uAlpha: { value: 1 } },
  vertexShader: `void main() {
      gl_Position = vec4(position, 1.0);
    }`,
  fragmentShader: `
    uniform float uAlpha;
    void main() {
      gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    }`,
});
const overlay = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2, 1, 1), overlayMaterial);
scene.add(overlay);

/***   Camera   ***/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 1, -4);
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/***   Renderer   ***/
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/***   Utils   ***/
// Update all materials
function updateAllMaterials() {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debug.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}
// Animate
(function tick() {
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
})();
