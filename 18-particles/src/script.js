import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**   Base   **/
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**   Textures   **/
const textureLoader = new THREE.TextureLoader();
const particleTextures = new Array(13)
  .fill('')
  .map((texture, i) => (texture = textureLoader.load(`/textures/particles/${i + 1}.png`)));

/**   Particles   **/
const count = 5000 * 4;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 10)),
  colors = new Float32Array(Array.from({ length: count * 3 }, () => Math.random()));
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.07,
  sizeAttenuation: true,
  // color: 'white',
  alphaMap: particleTextures[1],
  transparent: true,
  // alphaTest: 0.001,
  // depthTest: false, // problems with other ojects and colors
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});
const particles = new THREE.Points(particleGeometry, particlesMaterial);
scene.add(particles);

/**   Sizes   **/
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

/**   Camera   **/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**   Renderer   **/
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

console.log(particleGeometry, particleGeometry.attributes.position.array);
console.log(particles);

/**   Animate   **/
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate particles
  // particles.rotation.set(0, elapsedTime * 0.1, 0); // Whole thing
	// for (let i = 0; i < count * 3; i += 3) {
	// 	const x = particleGeometry.attributes.position.array[i];
	// 	particleGeometry.attributes.position.array[i + 1] = Math.sin(elapsedTime + x);
	// }
	// particleGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
