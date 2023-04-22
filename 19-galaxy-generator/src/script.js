import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**   Base   ***/
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**   Galaxy   ***/
let geometry = null,
  material = null,
  points = null;
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
};
const generateGalaxy = () => {
  // Destroy old galaxy
  if (points) geometry.dispose(), material.dispose(), scene.remove(points);
  // Geometry
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3),
    colors = new Float32Array(parameters.count * 3),
    colorInside = new THREE.Color(parameters.insideColor),
    colorOutside = new THREE.Color(parameters.outsideColor);
  for (let i = 0; i < parameters.count; i++) {
    // Position
    const radius = Math.random() * parameters.radius,
      branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2,
      spinAngle = radius * parameters.spin;
    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1),
      randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1),
      randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    if (i < 20) console.log(i, branchAngle, spinAngle);
    positions[i * 3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i * 3 + 1] = randomY;
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    // Color
    const mixedColor = colorInside.clone().lerp(colorOutside, radius / parameters.radius)
    colors[i * 3 + 0] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  // Material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });
  // Points
  points = new THREE.Points(geometry, material);
  scene.add(points);
};
generateGalaxy();
// Gui
const galaxySettings = gui.addFolder('Galaxy Settings');
galaxySettings.add(parameters, 'count', 100, 1000000, 100).onFinishChange(generateGalaxy);
galaxySettings.add(parameters, 'size', 0.001, 0.1, 0.001).onFinishChange(generateGalaxy);
galaxySettings.add(parameters, 'radius', 0.01, 20, 0.01).onFinishChange(generateGalaxy);
galaxySettings.add(parameters, 'branches', 2, 20, 1).onFinishChange(generateGalaxy);
galaxySettings.add(parameters, 'spin', -5, 5, 0.001).onFinishChange(generateGalaxy);
galaxySettings.add(parameters, 'randomness', 0, 2, 0.001).onFinishChange(generateGalaxy);
galaxySettings.add(parameters, 'randomnessPower', 1, 10, 0.001).onFinishChange(generateGalaxy);
galaxySettings.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
galaxySettings.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);
galaxySettings.open();

/**   Sizes   ***/
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

/**   Camera   ***/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**   Renderer   ***/
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**   Animate   ***/
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
