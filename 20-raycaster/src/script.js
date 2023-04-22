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

/**   Objects   **/
const object1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
);

const object3 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object3.position.x = 2;

const objects = [object1, object2, object3];
scene.add(...objects);

/**   Raycaster   **/
const raycaster = new THREE.Raycaster();
// let rayOrigin = new THREE.Vector3(-3, 0, 0), rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);
// const intersect = raycaster.intersectObject(object2);
// console.log(...intersect);
// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(...intersects);
// const line = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 0.01, 0.01), new THREE.MeshBasicMaterial());
// scene.add(line);
let currentIntersects = null;

/**   Sizes   **/
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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

/**   Mouse   **/
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});
window.addEventListener('click', (e) => {
	if (currentIntersects) {
		// console.log('SHOOT!');
		if (currentIntersects.object === object1) console.log('OBJECT1 DOWN!');
		else if (currentIntersects.object === object2) console.log('OBJECT2 DOWN!');
    else if (currentIntersects.object === object3) console.log('OBJECT3 DOWN!'); 
	}
})

/**   Camera   **/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**   Renderer   **/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**   Animate   **/
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update/animate spheres
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 1.4) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 0.8) * 1.5;

  // Cast a ray
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(objects);

  // Change object colors
  for (let obj of objects) obj.material.color = new THREE.Color('red');
  for (let obj of intersects) obj.object.material.color = new THREE.Color('blue');

  if (intersects.length) {
		// console.log(...intersects);
		if (!currentIntersects) console.log('mouse enter');
		currentIntersects = intersects[0];
	} else {
		if (currentIntersects) console.log('mouse leave');
    currentIntersects = null
		// console.log('nothing being hovered');
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
