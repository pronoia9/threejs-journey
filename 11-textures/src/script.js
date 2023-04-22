import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
// import imageSource from '../static/textures/door/color.jpg';

/**   Texture   **/
// const image = new Image(), const texture = new THREE.Texture(image);
// image.onload = () => { texture.needsUpdate = true; }, image.src = '/textures/rubix.png';
const loadingManager = new THREE.LoadingManager(
  (url, itemsLoaded, itemsTotal) => { console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.'); },
  (url, itemsLoaded, itemsTotal) => { console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.'); },
  (url) => { console.log('There was an error loading ' + url); }
);
const textureLoader = new THREE.TextureLoader(loadingManager);
// Textures
const colorTexture = textureLoader.load('/textures/door/color.jpg'),
  alphaTexture = textureLoader.load('/textures/door/alpha.jpg'),
  heightTexture = textureLoader.load('/textures/door/height.jpg'),
  normalTexture = textureLoader.load('/textures/door/normal.jpg'),
  ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg'),
  metalnessTexture = textureLoader.load('/textures/door/metalness.jpg'),
  roughnessTexture = textureLoader.load('/textures/door/roughness.jpg'),
  rubixTexture = textureLoader.load('/textures/rubix.png'),
  checkerboardTexture = textureLoader.load('/textures/checkerboard-8x8.png'),
  checkerboardLTexture = textureLoader.load('/textures/checkerboard-1024x1024.png'),
  minecraftTexture = textureLoader.load('/textures/minecraft.png');

// colorTexture.repeat.x = 2, colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping, colorTexture.wrapT = THREE.RepeatWrapping;
// colorTexture.offset.x = 0.5, colorTexture.offset.y = 0.5;
// colorTexture.rotation = Math.PI * 0.25;
// colorTexture.center.set(0.5, 0.5);
//
// colorTexture.minFilter = THREE.NearestFilter;
// colorTexture.minFilter = THREE.LinearFilter;
// colorTexture.minFilter = THREE.NearestMipmapNearestFilter;
// colorTexture.minFilter = THREE.NearestMipmapLinearFilter;
// colorTexture.minFilter = THREE.LinearMipmapNearestFilter;
// colorTexture.minFilter = THREE.LinearMipmapLinearFilter;
// checkerboardTexture.magFilter = THREE.NearestFilter;
//
minecraftTexture.generateMipmaps = false;
minecraftTexture.minFilter = THREE.NearestFilter;
minecraftTexture.magFilter = THREE.NearestFilter;

/**   DEBUG   **/
const gui = new dat.GUI({ closed: false, width: 400 });
const parameters = {
  color: '#00ADB5',
  colorTexture: colorTexture,
    spin: () => { /* gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 }); */ },
    camera: { position: { x: 0, y: 0, z: 1.25 } }
};

/**   Base   **/
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**   Object   **/
const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: minecraftTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
// Debug
gui.addFolder('Cube');
gui.add(mesh.position, 'x').min(-3).max(3).name('left/right').step(0.01);
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
gui.add(mesh.position, 'z').min(-3).max(3).name('closeness').step(0.01);
gui.add(material, 'wireframe').setValue(false);
gui.add(mesh, 'visible');
gui.addColor(parameters, 'color').onChange(() => { material.color.set(parameters.color); });
gui.add(parameters, 'spin');

/**   Sizes   **/
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth, sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Double click fullscreen
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) canvas.requestFullscreen ? canvas.requestFullscreen() : canvas.webkitRequestFullscreen();
  else document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
});

/**   Camera   **/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(parameters.camera.position.x, parameters.camera.position.y, parameters.camera.position.z);
scene.add(camera);
gui.addFolder('Camera');
gui.add(camera.position, 'x').min(-3).max(3).step(0.01).name('left/right');
gui.add(camera.position, 'y').min(-3).max(3).step(0.01).name('elevation');
gui.add(camera.position, 'z').min(-3).max(3).step(0.01).name('closeness');

// Controls
const controls = new OrbitControls(camera, canvas);
gui.addFolder('Orbit Controls');
gui.add(controls, 'enabled').setValue(true).name('enabled');
gui.add(controls, 'enableDamping').setValue(true).name('damping');

/**   Renderer   **/
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**   Animate   **/
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();