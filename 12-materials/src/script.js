import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import * as dat from 'dat.gui';

/**   Textures   **/
const textureManager = new THREE.LoadingManager(
  (url, loaded, total) => console.log(`Started loading file: ${url}.\nLoaded ${loaded} of ${total} files.`),
  (url, loaded, total) => console.log(`Loading file: ${url}.\nLoaded ${loaded} of ${total} files.`),
  (url) => console.log('There was an error loading ' + url)
);
const textureLoader = new THREE.TextureLoader(textureManager);
const cubeTextureLoader = new THREE.CubeTextureLoader();
// Textures
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg'),
  ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg'),
  colorTexture = textureLoader.load('/textures/door/color.jpg'),
  heightTexture = textureLoader.load('/textures/door/height.jpg'),
  metalnessTexture = textureLoader.load('/textures/door/metalness.jpg'),
  normalTexture = textureLoader.load('/textures/door/normal.jpg'),
  roughnessTexture = textureLoader.load('/textures/door/roughness.jpg'),
  gradientTexture = textureLoader.load('/textures/gradients/3.jpg'),
  matcapsTexture = textureLoader.load('/textures/matcaps/8.png');
(gradientTexture.minFilter = THREE.NearestFilter), (gradientTexture.magFilter = THREE.NearestFilter),
  (gradientTexture.generateMipmaps = false);
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
]);
  
/**   Debug   **/
const gui = new dat.GUI({ closed: false, width: 250 });
const defaults = {
  position: { min: -100, max: 100 },
  rotation: { min: -Math.PI, max: Math.PI },
  material: {
    type: 'Matcap',
    color: '#00ADB5',
    tint: true,
    wireframe: false,
    side: 2,
    map: false,
    alphaMap: false,
    opacity: 1,
    transparent: true,
    flatShading: false,
    metalness: 0.7,
    roughness: 0.2,
    ambientOcclusion: false,
  },
  sphere: { color: '#00ADB5', position: { x: -1.5, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
  plane: { color: '#00ADB5', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
  torus: { color: '#00ADB5', position: { x: 1.5, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
  camera: { position: { x: 0, y: 1, z: 3 } },
  spin: (mesh) => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
};

/**   Base   **/
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**   Object   **/
// const material = new THREE.MeshBasicMaterial({ color: defaults.material.color });
// const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshMatcapMaterial({ matcap: matcapsTexture });
// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial({ shininess: 100, specular: new THREE.Color('green') });
// const material = new THREE.MeshToonMaterial({ gradientMap: gradientTexture });
const material = new THREE.MeshStandardMaterial();
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(4, 4);
// material.transparent = true;
// material.alphaMap = alphaTexture;
material.envMap = environmentMapTexture;
console.log(material);
// Sphere
const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 64, 64), material);
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array), 2);
scene.add(sphere);
// Plane
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array), 2);
scene.add(plane);
// Torus
const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128), material);
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array), 2);
scene.add(torus);

/**   Lights   **/
const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight('white', 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**   Sizes   **/
const sizes = { width: window.innerWidth, height: window.innerHeight };
// Resize
window.addEventListener('resize', () => {
  // Update sizes
  (sizes.width = window.innerWidth), (sizes.height = window.innerHeight);
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen (annoying with debug panel)
// window.addEventListener('dblclick', () => {
//   const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
//   if (!fullscreenElement) canvas.requestFullscreen ? canvas.requestFullscreen() : canvas.webkitRequestFullscreen();
//   else document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
// });

/**   Camera   **/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**   Renderer   **/
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**   Animate   **/
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate
  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/**   DAT.GUI   **/
// Material
const materialProps = Object.keys(material).sort();
console.log(materialProps);
{
  const materialSettings = gui.addFolder('Material');
  // Wireframe
  materialProps.includes('wireframe') &&
    materialSettings.add(material, 'wireframe').setValue(defaults.material.wireframe);
  // Opacity
  materialProps.includes('opacity') &&
    materialSettings.add(material, 'opacity', 0, 1, 0.01).setValue(defaults.material.opacity);
  // Transparent
  materialProps.includes('transparent') &&
    materialSettings.add(material, 'transparent').setValue(defaults.material.transparent);
  // Side
  materialProps.includes('side') &&
    materialSettings
      .add(material, 'side')
      .options(0, 1, 2)
      .setValue(defaults.material.side)
      .onChange((value) => {
        if (value == 0) material.side = THREE.FrontSide;
        else if (value == 1) material.side = THREE.BackSide;
        else material.side = THREE.DoubleSide;
        material.needsUpdate = true;
      });
  // Color
  materialProps.includes('color') &&
    materialSettings
      .addColor(defaults.material, 'color')
      .setValue(defaults.material.color)
      .onChange(() => {
        material.color.set(defaults.material.color);
      });
  // Map
  materialProps.includes('map') &&
    materialSettings
      .add(defaults.material, 'map')
      .onChange((value) => {
        defaults.material.map = value;
        if (!value) defaults.material.alphaMap = false;
        material.map = defaults.material.map ? colorTexture : null;
        material.needsUpdate = true;
      })
      .listen();
  // AlphaMap
  materialProps.includes('alphaMap') &&
    materialSettings
      .add(defaults.material, 'alphaMap')
      .onChange((value) => {
        if (defaults.material.map) {
          defaults.material.alphaMap = value;
          material.alphaMap = defaults.material.map && defaults.material.alphaMap ? alphaTexture : null;
          material.needsUpdate = true;
        } else defaults.material.alphaMap = false;
      })
      .listen();
  // Ambient Occlusion
  materialProps.includes('aoMap') &&
    materialSettings.add(defaults.material, 'ambientOcclusion').onChange((value) => {
      if (value && material.map)
        (defaults.material.ambientOcclusion = true), (material.aoMap = ambientOcclusionTexture);
      else (defaults.material.ambientOcclusion = false), (material.aoMap = null);
      material.needsUpdate = true;
    });
  // Tint
  materialProps.includes('color') &&
    materialSettings.add(defaults.material, 'tint').onChange((value) => {
      if (!value) material.color.set('white');
      else material.color.set(defaults.material.color);
      material.needsUpdate = true;
    });
  // Flat Shading
  materialProps.includes('flatShading') &&
    materialSettings
      .add(material, 'flatShading')
      .setValue(defaults.material.flatShading)
      .onChange(() => (material.needsUpdate = true));
  // Metalness
  materialProps.includes('metalness') &&
    materialSettings.add(material, 'metalness', 0, 1).setValue(defaults.material.metalness).step(0.0001);
  // Roughness
  materialProps.includes('roughness') &&
    materialSettings.add(material, 'roughness', 0, 1).setValue(defaults.material.roughness).step(0.0001);
  materialSettings.open();
}
// Sphere
{
  const sphereSettings = gui.addFolder('Sphere');
  sphereSettings
    .add(sphere.position, 'x', defaults.position.min, defaults.position.max)
    .name('x: left/right')
    .step(0.01)
    .setValue(defaults.sphere.position.x)
    .listen();
  sphereSettings
    .add(sphere.position, 'y', defaults.position.min, defaults.position.max)
    .name('y: elevation')
    .step(0.01)
    .setValue(defaults.sphere.position.y)
    .listen();
  sphereSettings
    .add(sphere.position, 'z', defaults.position.min, defaults.position.max)
    .name('z: closeness')
    .step(0.01)
    .setValue(defaults.sphere.position.z)
    .listen();
  sphereSettings
    .add(sphere.rotation, 'x', defaults.position.min, defaults.rotation.max)
    .name('x rotation')
    .step(0.01)
    .setValue(defaults.sphere.rotation.x)
    .listen();
  sphereSettings
    .add(sphere.rotation, 'y', defaults.position.min, defaults.rotation.max)
    .name('y rotation')
    .step(0.01)
    .setValue(defaults.sphere.rotation.y)
    .listen();
  sphereSettings
    .add(sphere.rotation, 'z', defaults.position.min, defaults.rotation.max)
    .name('z rotation')
    .step(0.01)
    .setValue(defaults.sphere.rotation.z)
    .listen();
  sphereSettings.add(sphere, 'visible');
  sphereSettings.open();
}
// Plane
{
  const planeSettings = gui.addFolder('Plane');
  planeSettings
    .add(plane.position, 'x', defaults.position.min, defaults.position.max)
    .name('x: left/right')
    .step(0.01)
    .setValue(defaults.plane.position.x)
    .listen();
  planeSettings
    .add(plane.position, 'y', defaults.position.min, defaults.position.max)
    .name('y: elevation')
    .step(0.01)
    .setValue(defaults.plane.position.y)
    .listen();
  planeSettings
    .add(plane.position, 'z', defaults.position.min, defaults.position.max)
    .name('z: closeness')
    .step(0.01)
    .setValue(defaults.plane.position.z)
    .listen();
  planeSettings
    .add(plane.rotation, 'x', defaults.position.min, defaults.rotation.max)
    .name('x rotation')
    .step(0.01)
    .setValue(defaults.plane.rotation.x)
    .listen();
  planeSettings
    .add(plane.rotation, 'y', defaults.position.min, defaults.rotation.max)
    .name('y rotation')
    .step(0.01)
    .setValue(defaults.plane.rotation.y)
    .listen();
  planeSettings
    .add(plane.rotation, 'z', defaults.position.min, defaults.rotation.max)
    .name('z rotation')
    .step(0.01)
    .setValue(defaults.plane.rotation.z)
    .listen();
  planeSettings.add(plane, 'visible');
  planeSettings.open();
}
// Torus
{
  const torusSettings = gui.addFolder('Torus');
  torusSettings
    .add(torus.position, 'x', defaults.position.min, defaults.position.max)
    .name('x: left/right')
    .step(0.01)
    .setValue(defaults.torus.position.x)
    .listen();
  torusSettings
    .add(torus.position, 'y', defaults.position.min, defaults.position.max)
    .name('y: elevation')
    .step(0.01)
    .setValue(defaults.torus.position.y)
    .listen();
  torusSettings
    .add(torus.position, 'z', defaults.position.min, defaults.position.max)
    .name('z: closeness')
    .step(0.01)
    .setValue(defaults.torus.position.z)
    .listen();
  torusSettings
    .add(torus.rotation, 'x', defaults.position.min, defaults.rotation.max)
    .name('x rotation')
    .step(0.01)
    .setValue(defaults.torus.rotation.x)
    .listen();
  torusSettings
    .add(torus.rotation, 'y', defaults.position.min, defaults.rotation.max)
    .name('y rotation')
    .step(0.01)
    .setValue(defaults.torus.rotation.y)
    .listen();
  torusSettings
    .add(torus.rotation, 'z', defaults.position.min, defaults.rotation.max)
    .name('z rotation')
    .step(0.01)
    .setValue(defaults.torus.rotation.z)
    .listen();
  torusSettings.add(torus, 'visible');
  torusSettings.open();
}
// Camera
{
  const cameraSettings = gui.addFolder('Camera');
  cameraSettings
    .add(camera.position, 'x', defaults.position.min, defaults.position.max)
    .step(0.01)
    .name('left/right')
    .setValue(defaults.camera.position.x)
    .listen();
  cameraSettings
    .add(camera.position, 'y', defaults.position.min, defaults.position.max)
    .step(0.01)
    .name('elevation')
    .setValue(defaults.camera.position.y)
    .listen();
  cameraSettings
    .add(camera.position, 'z', defaults.position.min, defaults.position.max)
    .step(0.01)
    .name('closeness')
    .setValue(defaults.camera.position.z)
    .listen();
  cameraSettings.open();
}
