import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/*   BASE   */
/*   Canvas   */
const canvas = document.querySelector('canvas.webgl');

/*   Scene   */
const scene = new THREE.Scene();

/*   Object   */
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
// const geometry = new THREE.Geometry();
/*   Vertices   */
// // const vertices = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0)];
// // geometry.vertices.push(...vertices);
/*   Face   */
// // const face = new THREE.Face3(0, 1, 2);
// // geometry.faces.push(face);
/*   Lots of Triangles   */
// for (let i = 0; i < 50; i++) {
//   for (let j = 0; j < 3; j++) {
//     geometry.vertices.push(
//       new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4)
//     );
//   }
//   const verticesIdx = i * 3;
//   geometry.faces.push(new THREE.Face3(verticesIdx + 0, verticesIdx + 1, verticesIdx + 2));
// }
/*   Buffer Geometry   */
// const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 3, 3, 3);
//
// const positionsArray = new Float32Array(9);
// for (let i = 0; i < positionsArray.length; i++) positionsArray[i] = ((i === 4 || i === 6) ? (1) : 0);
// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute('position', positionsAttribute);
//
const count = 50;
const positionsArray = new Float32Array(new Array(count * 3 * 3).fill(0).map((e) => (e = (Math.random() - 0.5) * 4)));
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', positionsAttribute);
//
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/*   Sizes   */
const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener('resize', () => {
  /*   Update sizes   */
  (sizes.width = window.innerWidth), (sizes.height = window.innerHeight);

  /*   Update camera   */
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  /*   Update renderer   */
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/*   Camera   */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

/*   Controls   */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/*   Renderer   */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/*   Animate   */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  /*   Update controls   */
  controls.update();

  /*   Render   */
  renderer.render(scene, camera);

  /*   Call tick again on the next frame   */
  window.requestAnimationFrame(tick);
};

tick();
