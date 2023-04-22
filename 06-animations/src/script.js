import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

console.log(gsap);

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: '#00ADB5' });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = { width: 800, height: 600 };

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

// Time
// let time = Date.now();

// Clock
const clock = new THREE.Clock();
console.log(clock.getElapsedTime);
console.log(clock.getDelta);

// GSAP
gsap.to(mesh.position, { duration: 3, delay: 1, x: 2 })
gsap.to(mesh.position, { duration: 3, delay: 4, x: 0 });

// Animations
const tick = () => {
  // Time
  // const currTime = Date.now(), deltaTime = currTime - time;
  // time = currTime;
  // console.log(deltaTime);

  // Clock
  const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime);

  // Update objects
  // mesh.position.x += 0.01;
  // mesh.rotation.y += 0.001 * deltaTime;
  // mesh.rotation.y = elapsedTime;
  // mesh.rotation.y = elapsedTime * Math.PI;
  // mesh.position.x = Math.cos(elapsedTime);
  // mesh.position.y = Math.sin(elapsedTime);
  // camera.lookAt(mesh.position);

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();