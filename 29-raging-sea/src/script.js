import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import vertexShader from './shaders/water/vertex.glsl';
import fragmentShader from './shaders/water/fragment.glsl';

/***   Base   ***/
// Debug
const gui = new dat.GUI({ width: 340 });
const debug = { depthColor: '#186691', surfaceColor: '#9bd8ff' };
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();

/***   Water   ***/
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);
// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  // wireframe: true,
  transparent: true,
  uniforms: {
    uTime: { value: 0 },
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(debug.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debug.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 2.0 },
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3.0 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallIteration: { value: 4.0 },
  },
});
// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

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

/***   Camera   ***/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/***   Renderer   ***/
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/***   Utils   ***/
// Animate
const clock = new THREE.Clock();
(function tick() {
  const elapsedTime = clock.getElapsedTime();
  // Update water
  waterMaterial.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
})();

/***   Debug   ***/
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value', 0, 1, 0.001).name('big waves elevation');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0, 10, 0.001).name('big waves frequency X');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0, 10, 0.001).name('big waves frequency Y');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value', 0, 5, 0.001).name('big waves speed');
gui.addColor(debug, 'depthColor').name('depth color').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debug.depthColor); });
gui.addColor(debug, 'surfaceColor').name('surface color').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debug.surfaceColor); });
gui.add(waterMaterial.uniforms.uColorOffset, 'value', 0, 1, 0.001).name('color offset');
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value', 0, 10, 0.001).name('color multiplier');
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value', 0, 1, 0.001).name('small waves elevation');
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0, 30, 0.001).name('small waves frequency');
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0, 5, 0.001).name('small waves speed');
gui.add(waterMaterial.uniforms.uSmallIteration, 'value', 0, 8, 0.001).name('small iteration');