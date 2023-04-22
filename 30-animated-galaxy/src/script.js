import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import vertexShader from './shaders/galaxy/vertex.glsl';
import fragmentShader from './shaders/galaxy/fragment.glsl';

/***   Base   ***/
// Debug
const gui = new dat.GUI();
const debug = {
  count: 200000,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.5,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
  size: 30.0,
  lightPointStrength: 10.0,
};
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();

/***   Galaxy   ***/
let geometry = null,
  material = null,
  points = null;
// Debug
gui.add(debug, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(debug, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(debug, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(debug, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(debug, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(debug, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(debug, 'outsideColor').onFinishChange(generateGalaxy);
gui.add(debug, 'size').min(5).max(50).step(0.001).onFinishChange(generateGalaxy);
gui.add(debug, 'lightPointStrength').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);

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
camera.position.set(3, 3, 3);
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/***   Renderer   ***/
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/***   Utils   ***/
// Galaxy
function generateGalaxy() {
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  // Geometry
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(debug.count * 3),
    colors = new Float32Array(debug.count * 3),
    scales = new Float32Array(debug.count),
    randomness = new Float32Array(debug.count * 3);
  const insideColor = new THREE.Color(debug.insideColor),
    outsideColor = new THREE.Color(debug.outsideColor);
  for (let i = 0, i3 = 0; i < debug.count; i++, i3 = i * 3) {
    // Position
    const radius = Math.random() * debug.radius;
    const branchAngle = ((i % debug.branches) / debug.branches) * Math.PI * 2;
    positions[i3 + 0] = Math.cos(branchAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngle) * radius;
    // Randomness
    const randomX =
      Math.pow(Math.random(), debug.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * debug.randomness * radius;
    const randomY =
      Math.pow(Math.random(), debug.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * debug.randomness * radius;
    const randomZ =
      Math.pow(Math.random(), debug.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * debug.randomness * radius;
    randomness[i3 + 0] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;
    // Color
    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / debug.radius);
    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
    // Scale
    scales[i] = Math.random();
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
  // Material
  material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: debug.size * renderer.getPixelRatio() },
      uLightPointStrength: { value: debug.lightPointStrength },
    },
  });
  // Points
  points = new THREE.Points(geometry, material);
  scene.add(points);
}
generateGalaxy();
// Animate
const clock = new THREE.Clock();
(function tick() {
  const elapsedTime = clock.getElapsedTime();
  // Update material
  material.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
})();