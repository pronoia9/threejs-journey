import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/***   Loader   ***/
const gltfLoader = new GLTFLoader();

/***   Base   ***/
// Debug
const gui = new dat.GUI();
const debug = { environmentMap: 0, environmentMapIntensity: 5 };
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();

/***   Textures   ***/
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMaps = Array.from({ length: 4 }, (val, i) => {
  val = cubeTextureLoader.load(
    Array.from({ length: 6 }, (v, j) => `/textures/environmentMaps/${i}/${['px', 'nx', 'py', 'ny', 'pz', 'nz'][j]}.jpg`)
  );
  val.encoding = THREE.sRGBEncoding;
  return val;
});
scene.background = environmentMaps[debug.environmentMap];
scene.environment = environmentMaps[debug.environmentMap];
const environmentSettings = gui.addFolder('Environment');
environmentSettings.open();
environmentSettings
  .add(debug, 'environmentMap')
  .options({ 'Back Alley [Italy]': 0, Field: 1, 'Back Alley [U.S.]': 2, 'Diagon Alley?': 3 })
  .onChange((val) => {
    scene.background = environmentMaps[debug.environmentMap];
    scene.environment = environmentMaps[debug.environmentMap];
  });
environmentSettings
  .add(debug, 'environmentMapIntensity', 0, 10, 0.001)
  .name('env map intensity')
  .onChange(() =>
    updateAllMeshes((mesh) => {
      mesh.material.envMapIntensity = debug.environmentMapIntensity;
    })
  );

/***   Models   ***/
const modelsSettings = gui.addFolder('Models');
modelsSettings.open();
// Helmet
// gltfLoader.load(
//   '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//   (gltf) => {
//     gltf.scene.scale.set(10, 10, 10);
//     gltf.scene.position.set(0, -4, 0);
//     scene.add(gltf.scene);
//     updateAllMeshes((mesh) => {
//       mesh.material.envMapIntensity = debug.environmentMapIntensity;
//       mesh.castShadow = true;
//       mesh.receiveShadow = true;
//     });
//     // Debug
//     modelsSettings
//       .add(gltf.scene.rotation, 'y', -Math.PI, Math.PI, 0.001)
//       .name('rotation y')
//       .setValue(Math.PI * 0.5);
//   },
//   () => console.log('Loading...'),
//   () => console.log('Failed to load model.')
// );
// Hamburger
gltfLoader.load(
  '/models/hamburger.glb',
  (gltf) => {
    gltf.scene.scale.set(0.3, 0.3, 0.3);
    gltf.scene.position.set(0, -1, 0);
    scene.add(gltf.scene);
    updateAllMeshes((mesh) => {
      mesh.material.envMapIntensity = debug.environmentMapIntensity;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
    // Debug
    modelsSettings
      .add(gltf.scene.rotation, 'y', -Math.PI, Math.PI, 0.001)
      .name('rotation y')
      .setValue(Math.PI * 0.5);
  },
  () => console.log('Loading...'),
  () => console.log('Failed to load model.')
);

/***   Lights   ***/
const lights = { directional: new THREE.DirectionalLight('#fff', 1) };
lights.directional.shadow.camera.far = 15;
lights.directional.shadow.mapSize.set(1024, 1024);
scene.add(...Object.values(lights));
// Camera helpers
const lightCameraHelpers = { directionalShadow: new THREE.CameraHelper(lights.directional.shadow.camera) };
scene.add(...Object.values(lightCameraHelpers));
// Debug
const lightSettings = gui.addFolder('Light');
lightSettings.open();
lightSettings.add(lights.directional, 'visible').name('directional light').setValue(true);
lightSettings.add(lights.directional.position, 'x', -5, 5, 0.001).name('position x').setValue(0.25);
lightSettings.add(lights.directional.position, 'y', -5, 5, 0.001).name('position y').setValue(3);
lightSettings.add(lights.directional.position, 'z', -5, 5, 0.001).name('position z').setValue(-2.25);
lightSettings.add(lights.directional, 'castShadow').name('cast shadow').setValue(true);
lightSettings.add(lights.directional, 'intensity', 0, 10, 0.001).setValue(3);
lightSettings.add(lights.directional.shadow, 'normalBias', 0, 1, 0.001).setValue(0.05);
lightSettings.add(lightCameraHelpers.directionalShadow, 'visible').name('light camera helper').setValue(false);

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
const renderer = new THREE.WebGLRenderer({ canvas, antialias: window.devicePixelRatio == 1 ? true : false });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
environmentSettings
  .add(renderer, 'toneMapping')
  .name('tone mapping')
  .options({
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .setValue(THREE.ACESFilmicToneMapping)
  .onChange(() => {
    updateAllMeshes();
    return Number(renderer.toneMapping);
  });
environmentSettings.add(renderer, 'toneMappingExposure', 0, 10, 0.001).name('tone exposure');
environmentSettings.add(renderer.shadowMap, 'enabled').name('shadow map').setValue(true);
environmentSettings
  .add(renderer.shadowMap, 'type')
  .name('shadow map type')
  .options({
    Basic: THREE.BasicShadowMap,
    VSM: THREE.VSMShadowMap,
    PCF: THREE.PCFShadowMap,
    PCFSoft: THREE.PCFSoftShadowMap,
  })
  .setValue(THREE.PCFSoftShadowMap);

/***   Utils   ***/
function updateAllObjects(func) {
  scene.traverse((child) => {
    func(child);
  });
}

function updateAllMeshes(foo = null) {
  updateAllObjects((mesh) => {
    if (mesh instanceof THREE.Mesh && mesh.material instanceof THREE.MeshStandardMaterial) {
      if (foo) foo(mesh);
      mesh.material.needsUpdate = true;
    }
  });
}

// Animate
(function tick() {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
})();