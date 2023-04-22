import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

const loadingBar = document.querySelector('.loading-bar');

/***   Loaders   ***/
let sceneReady = false;
const loadingManager = new THREE.LoadingManager(
  () => {
    console.log('Loading complete!');
    setTimeout(() => {
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 });
      loadingBar.classList.add('ended');
      loadingBar.style.transform = '';
      sceneReady = true;
    }, 500);
  },
  (url, itemsLoaded, itemsTotal) => {
    // console.log(`Loading file: ${url.split('/').pop()}\nLoaded ${itemsLoaded}/${itemsTotal} files.`);
    loadingBar.style.transform = `scaleX(${itemsLoaded / itemsTotal})`;
  },
  (url) => {
    console.log('There was an error loading ' + url);
  }
);
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

/***   Base   ***/
// Debug
const debugObject = {};
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();

/***   Overlay   ***/
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms: { uAlpha: { value: 1 } },
  vertexShader: `void main() { gl_Position = vec4(position, 1.0);}`,
  fragmentShader: `uniform float uAlpha; void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha); }`,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/***   Environment map   ***/
const environmentMap = Array.from({ length: 1 }, (v, i) =>
  cubeTextureLoader.load(
    Array.from({ length: 6 }, (v, j) => `/textures/environmentMaps/${i}/${['px', 'nx', 'py', 'ny', 'pz', 'nz'][j]}.jpg`)
  )
)[0];
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
scene.environment = environmentMap;
debugObject.envMapIntensity = 2.5;

/***   Models   ***/
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(2.5, 2.5, 2.5);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);
  updateAllMaterials();
});

/***   Points of interest   ***/
const raycaster = new THREE.Raycaster();
const points = Array.from({ length: 3 }, (v, i) => ({
  position: null,
  element: document.querySelectorAll('.point')[i],
}));
points[0].position = new THREE.Vector3(1.55, 0.3, -0.6);
points[1].position = new THREE.Vector3(0.5, 0.8, -1.6);
points[2].position = new THREE.Vector3(1.6, -1.3, -0.7);

/***   Lights   ***/
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

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
camera.position.set(4, 1, -4);
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/***   Renderer   ***/
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/***   Utils   ***/
// Update all materials
function updateAllMaterials() {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}
// Animate
(function tick() {
  // Update controls
  controls.update();
  if (sceneReady) {
    // Go through each point
    for (const point of points) {
      const screenPosition = point.position.clone();
      screenPosition.project(camera);

      raycaster.setFromCamera(screenPosition, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (!intersects.length) point.element.classList.add('visible');
      else {
        const intersectionDistance = intersects[0].distance,
          pointDistance = point.position.distanceTo(camera.position);
        if (intersectionDistance < pointDistance) point.element.classList.remove('visible');
      }

      const translateX = screenPosition.x * sizes.width * 0.5,
        translateY = -screenPosition.y * sizes.height * 0.5;
      point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    }
  }
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
})();