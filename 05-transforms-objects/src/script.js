import './style.css';
import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: '#00ADB5' });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// Group
const group = new THREE.Group();
scene.add(group);

const cubes = [
  new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: '#00ADB5' })),
  new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: '#FF2E63' })),
  new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: '#EEEEEE' })),
];
cubes[1].position.x = -2;
cubes[2].position.x = 2;
group.add(...cubes);


// Position
// mesh.position.x = 0.7, mesh.position.y = -0.6, mesh.position.z = 1;
// mesh.position.set(0.7, -0.6, 1);
group.position.y = 1;

// Scale
// mesh.scale.x = 1, mesh.scale.y = 0.5, mesh.scale.z = 2;
// mesh.scale.set(2, 0.5, 0.5);
group.scale.y = 2;

// Rotate
// mesh.rotation.reorder('YXZ');
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;
// mesh.rotation.z = Math.PI * 0.1;
// mesh.rotation.set(0, 0, 0);
group.rotation.y = 1;

/*************************  TESTING  *************************/
// console.log('position:', mesh.position);
// console.log('length():', mesh.position.length());
// console.log('---------------------------------------------------------------------------------');
// // mesh.position.normalize();
// // console.log('normalize:', mesh.position.normalize);
// console.log('---------------------------------------------------------------------------------');
// console.log('position:', mesh.position);
// console.log('length():', mesh.position.length());
// console.log('---------------------------------------------------------------------------------');
// console.log('length:', mesh.position.length);
// console.log('---------------------------------------------------------------------------------');
// console.log('distanceTo:', mesh.position.distanceTo, mesh.position.distanceToSquared);
// console.log('distanceTo(new Vector3(0, 1, 2)):', mesh.position.distanceTo(new THREE.Vector3(0, 1, 2)));
// console.log('---------------------------------------------------------------------------------');
/*************************************************************/

// Axes helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Sizes
const sizes = { width: 800, height: 600 };

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// camera.position.x = 0.2, camera.position.y = 0.1, camera.position.z = 3;
camera.position.set(0, 0, 3);
scene.add(camera);

/*************************  TESTING  *************************/
// console.log('distanceTo(camera.position):', mesh.position.distanceTo(camera.position));
// console.log('---------------------------------------------------------------------------------');
/*************************************************************/

// Look at
// camera.lookAt(new THREE.Vector3(0, 0, 0));
// camera.lookAt(mesh.position);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
