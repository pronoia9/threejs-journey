import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**   Base   **/
// Debug
const gui = new dat.GUI({ width: 325 });

/** Textures  **/
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg'),
  simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');

// Canvas
const canvas = document.querySelector('canvas.webgl');
7;
// Scene
const scene = new THREE.Scene();

/**   Lights   **/
const ambientLight = new THREE.AmbientLight(0xffffff);
// Directional
const directionalLight = new THREE.DirectionalLight(0xffffff),
  directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
console.log(directionalLight.shadow);
directionalLight.shadow.mapSize.set(1024, 1024);
(directionalLight.shadow.camera.near = 1), (directionalLight.shadow.camera.far = 6);
(directionalLight.shadow.camera.top = 2), (directionalLight.shadow.camera.right = 2);
(directionalLight.shadow.camera.bottom = -2), (directionalLight.shadow.camera.left = -2);
// Spot
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3),
  spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
spotLight.shadow.mapSize.set(1024, 1024), (spotLight.shadow.camera.near = 1), (spotLight.shadow.camera.far = 6);
spotLight.shadow.camera.fov = 30;
// Point
const pointLight = new THREE.PointLight(0xffffff, 0.3),
  pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
pointLight.shadow.mapSize.set(1024, 1024);
(pointLight.shadow.camera.near = 0.1), (pointLight.shadow.camera.far = 5);
scene.add(
  ambientLight,
  directionalLight,
  directionalLightHelper,
  spotLight,
  spotLightHelper,
  pointLight,
  pointLightHelper
);

/**   Materials   **/
const material = new THREE.MeshStandardMaterial();
// const bakedShadowMaterial = new THREE.MeshBasicMaterial({ map: bakedShadow });

/**   Objects   **/
const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material);
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: simpleShadow, transparent: true })
);
(plane.rotation.x = -Math.PI * 0.5), (plane.position.y = -0.5);
(sphereShadow.rotation.x = -Math.PI * 0.5), (sphereShadow.position.y = plane.position.y + 0.01);
scene.add(sphere, sphereShadow, plane);

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
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera),
  spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera),
  pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(camera, directionalLightCameraHelper, spotLightCameraHelper, pointLightCameraHelper);
// Controls
const controls = new OrbitControls(camera, canvas);

/**   Renderer   **/
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**   Animate   **/
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Animation
  sphere.position.set(Math.cos(elapsedTime) * 1.5, Math.abs(Math.sin(elapsedTime * 3)), Math.sin(elapsedTime) * 1.5);
  sphereShadow.position.set(sphere.position.x, sphereShadow.position.y, sphere.position.z);
  sphereShadow.material.opacity = (1 - sphere.position.y) * 1.5;
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();

/***   GUI   ***/
// LIGHTS
{
  const lightSettings = gui.addFolder('LIGHT SETINGS');
  {
    const ambientLightSettings = lightSettings.addFolder('Ambient Light');
    ambientLightSettings.add(ambientLight, 'visible').setValue(true);
    ambientLightSettings.add(ambientLight, 'intensity', 0, 1).step(0.001).setValue(0.3);
    // ambientLightSettings.open();
  }
  {
    const directionalLightSettings = lightSettings.addFolder('Directional Light');
    const directionalLightSettingsPos = directionalLightSettings.addFolder('Directional Light Position');
    directionalLightSettingsPos.add(directionalLight.position, 'x', -10, 10).step(0.001).name('position x').setValue(2);
    directionalLightSettingsPos.add(directionalLight.position, 'y', -10, 10).step(0.001).name('position y').setValue(2);
    directionalLightSettingsPos
      .add(directionalLight.position, 'z', -10, 10)
      .step(0.001)
      .name('position z')
      .setValue(-1);
    // directionalLightSettingsPos.open();
    directionalLightSettings.add(directionalLight, 'visible').setValue(true);
    directionalLightSettings.add(directionalLight, 'intensity', 0, 1).step(0.001).setValue(0.3);
    directionalLightSettings.add(directionalLight, 'castShadow').name('cast shadow').setValue(true);
    directionalLightSettings.add(directionalLight.shadow, 'radius', 0, 100).name('shadow blur').step(0.01);
    directionalLightSettings.add(directionalLightHelper, 'visible').name('light helper').setValue(false);
    directionalLightSettings.add(directionalLightCameraHelper, 'visible').name('camera helper').setValue(false);
    // directionalLightSettings.open();
  }
  {
    const spotLightSettings = gui.addFolder('Spot Light');
    const spotLightSettingsPos = spotLightSettings.addFolder('SpotLight Position');
    spotLightSettingsPos.add(spotLight.position, 'x', -10, 10).step(0.01).name('position x').setValue(0);
    spotLightSettingsPos.add(spotLight.position, 'y', -10, 10).step(0.01).name('position y').setValue(2);
    spotLightSettingsPos.add(spotLight.position, 'z', -10, 10).step(0.01).name('position z').setValue(2);
    const spotLightSettingsTargetPos = spotLightSettings.addFolder('SpotLight Target Position');
    spotLightSettingsTargetPos.add(spotLight.target.position, 'x', -10, 10).step(0.01).name('target pos x');
    spotLightSettingsTargetPos.add(spotLight.target.position, 'y', -10, 10).step(0.01).name('target pos y');
    spotLightSettingsTargetPos.add(spotLight.target.position, 'z', -10, 10).step(0.01).name('target pos z');
    spotLightSettings.add(spotLight, 'visible').setValue(true);
    spotLightSettings.add(spotLight, 'intensity', 0, 1).step(0.001);
    spotLightSettings.add(spotLight, 'distance', 0, 100).step(0.001);
    spotLightSettings.add(spotLight, 'angle', -Math.PI * 2, Math.PI * 2).step(0.001);
    spotLightSettings.add(spotLight, 'penumbra', 0, 1).step(0.001);
    spotLightSettings.add(spotLight, 'decay', 0, 10).step(0.001);
    spotLightSettings.add(spotLight, 'castShadow').name('cast shadow').setValue(true);
    spotLightSettings.add(spotLightHelper, 'visible').name('light helper').setValue(false);
    spotLightSettings.add(spotLightCameraHelper, 'visible').name('camera helper').setValue(false);
    // spotLightSettings.open();
  }
  {
    const pointLightSettings = gui.addFolder('Point Light');
    const pointLightSettingsPos = pointLightSettings.addFolder('Point Light Position');
    pointLightSettingsPos.add(pointLight.position, 'x', -10, 10).step(0.01).setValue(2).name('position x').setValue(-1);
    pointLightSettingsPos.add(pointLight.position, 'y', -10, 10).step(0.01).setValue(3).name('position y').setValue(1);
    pointLightSettingsPos.add(pointLight.position, 'z', -10, 10).step(0.01).setValue(4).name('position z').setValue(0);
    // pointLightSettingsPos.open();
    pointLightSettings.add(pointLight, 'visible').setValue(true);
    pointLightSettings.add(pointLight, 'intensity', 0, 1).step(0.001);
    pointLightSettings.add(pointLight, 'distance', 0, 100).step(0.1);
    pointLightSettings.add(pointLight, 'decay', 0, 2).step(0.1);
    pointLightSettings.add(pointLight, 'castShadow').name('cast shadow').setValue(true);
    pointLightSettings.add(pointLightHelper, 'visible').name('light helper').setValue(true);
    pointLightSettings.add(pointLightHelper, 'visible').name('camera helper').setValue(true);
    pointLightSettings.open();
  }
  lightSettings.open();
}
// MATERIAL
{
  const materialSettings = gui.addFolder('MATERIAL SETTINGS');
  materialSettings.add(material, 'metalness').min(0).max(1).step(0.001);
  materialSettings.add(material, 'roughness').min(0).max(1).step(0.001).setValue(0.7);
  //   materialSettings.open();
}
// OBJECTS
{
  const objectSettings = gui.addFolder('OBJECT SETTINGS');
  {
    const sphereSettings = objectSettings.addFolder('Sphere Settings');
    sphereSettings.add(sphere, 'castShadow').name('cast shadow').setValue(true);
    sphereSettings.open();
  }
  {
    const planeSettings = objectSettings.addFolder('Plane Settings');
    planeSettings.add(plane, 'receiveShadow').name('receive shadow').setValue(true);
    planeSettings.open();
  }
  // objectSettings.open();
}
// CAMERA
{
  {
    const cameraSettings = gui.addFolder('CAMERA SETTINGS');
    cameraSettings
      .add(camera.position, 'x', -100, 100)
      .step(0.01)
      .name('position x')
      .setValue(1 || 2.79)
      .listen();
    cameraSettings
      .add(camera.position, 'y', -100, 100)
      .step(0.01)
      .name('position y')
      .setValue(1 || 2.79)
      .listen();
    cameraSettings
      .add(camera.position, 'z', -100, 100)
      .step(0.01)
      .name('position z')
      .setValue(2 || 5.58)
      .listen();
  }
  {
    const cameraSettings = gui.addFolder('CONTROL SETTINGS');
    cameraSettings.add(controls, 'enableDamping').name('damping').setValue(true);
  }
  // cameraSettings.open();
}
// RENDERER
{
  const rendererSettings = gui.addFolder('RENDERER SETTINGS');
  rendererSettings.add(renderer.shadowMap, 'enabled').name('shadow map').setValue(false);
  rendererSettings
    .add(renderer.shadowMap, 'type')
    .name('shadow map type')
    .options(THREE.BasicShadowMap, THREE.PCFShadowMap, THREE.PCFSoftShadowMap, THREE.VSMShadowMap)
    .setValue(THREE.PCFSoftShadowMap);
  // rendererSettings.open();
}
