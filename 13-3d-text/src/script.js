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

// Axis helper
// const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);

/**   Textures   **/
const textureManager = new THREE.LoadingManager(
  () => console.log('Loading textures complete!'),
  (url, loaded, total) => console.log('Loading file: ' + url + '.\nLoaded ' + loaded + ' of ' + total + ' files.'),
  (url) => console.log('There was an error loading ' + url)
);
const textureLoader = new THREE.TextureLoader(textureManager);
const matcapTexture = textureLoader.load('/textures/matcaps/10.jpg');

/**   Materials  **/
const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

/**   Object   **/
const makeRandomObjects = (geometry, material, num) => {
  try {
    for (let i = 0; i < num; i++) {
      const object = new THREE.Mesh(geometry, material);
      object.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
      object.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = Math.random();
      object.scale.set(scale, scale, scale);
      scene.add(object);
    }
  } catch (e) {
    console.error(e);
  }
};
makeRandomObjects(new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45), matcapMaterial, 500);
makeRandomObjects(new THREE.BoxBufferGeometry(1, 1, 1), matcapMaterial, 500);

/**   Fonts   **/
const fontLoader = new THREE.FontLoader();
fontLoader.load('/fonts/green-park_bold_typeface.json',
  (font) => {
    console.log(font, font.data);
    const textGeometry = new THREE.TextBufferGeometry(
      'web developer\ncreative designer\nprocrastinator\ntechnophile geek',
      { font, size: 0.5, height: 0.75, curveSegments: 5, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelOffset: 0, bevelSegments: 4 });
    textGeometry.center();
    const text = new THREE.Mesh(textGeometry, matcapMaterial);
    scene.add(text);
  },
  (xhr) => console.log('Font ' + (xhr.loaded / xhr.total) * 100 + '% loaded.'),
  (err) => console.log('An error happened loading font.')
);

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

/**   Camera   **/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
