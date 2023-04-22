import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import * as dat from 'dat.gui';

/**   Base   **/
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**   Lights   **/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.lookAt(new THREE.Vector3());
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
scene.add(ambientLight, directionalLight, hemisphereLight, pointLight, rectAreaLight, spotLight, spotLight.target);

/**   Light Helpers   **/
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
window.requestAnimationFrame(() => {
  rectAreaLightHelper.position.copy(rectAreaLight.position);
  rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion);
  spotLightHelper.update();
});
scene.add(directionalLightHelper, hemisphereLightHelper, pointLightHelper, rectAreaLightHelper, spotLightHelper);

/**   Materials   **/
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

/**  Objects   **/
const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;
const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(0.75, 0.75, 0.75), material);
const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64), material);
torus.position.x = 1.5;
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
plane.position.y = -0.65;
plane.rotation.x = -Math.PI * 0.5;
scene.add(sphere, cube, torus, plane);

/**   Sizes   **/
const sizes = { width: window.innerWidth, height: window.innerHeight };

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

/**   Camera   **/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 2);
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

  // Update objects
  sphere.rotation.set(0.15 * elapsedTime, 0.1 * elapsedTime, 0);
  cube.rotation.set(0.15 * elapsedTime, 0.1 * elapsedTime, 0);
  torus.rotation.set(0.15 * elapsedTime, 0.1 * elapsedTime, 0);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// Ambient Light
{
  const ambientLightSettings = gui.addFolder('Ambient Light');
  ambientLightSettings.add(ambientLight, 'visible').setValue(true);
  ambientLightSettings.add(ambientLight, 'intensity', 0, 1).step(0.001);
  const ambientLightSettingsPos = ambientLightSettings.addFolder('Ambient Light Position');
  ambientLightSettingsPos.add(ambientLight.position, 'x', -10, 10).step(0.01).name('position x');
  ambientLightSettingsPos.add(ambientLight.position, 'y', -10, 10).step(0.01).name('position y');
  ambientLightSettingsPos.add(ambientLight.position, 'z', -10, 10).step(0.01).name('position z');
  ambientLightSettings.open();
  ambientLightSettingsPos.open();
}
// Directional Light
{
  const directionalLightSettings = gui.addFolder('Directional Light');
  directionalLightSettings.add(directionalLight, 'visible').setValue(false);
  directionalLightSettings.add(directionalLightHelper, 'visible').setValue(false).name('helper');
  directionalLightSettings.add(directionalLight, 'intensity', 0, 1).step(0.001);
  const directionalLightSettingsPos = directionalLightSettings.addFolder('Directional Light Position');
  directionalLightSettingsPos.add(directionalLight.position, 'x', -10, 10).step(0.01).name('position x');
  directionalLightSettingsPos.add(directionalLight.position, 'y', -10, 10).step(0.01).name('position y');
  directionalLightSettingsPos.add(directionalLight.position, 'z', -10, 10).step(0.01).name('position z');
  directionalLightSettings.open();
  directionalLightSettingsPos.open();
}
// Hemisphere Light
{
  const hemisphereLightSettings = gui.addFolder('Hemisphere Light');
  hemisphereLightSettings.add(hemisphereLight, 'visible').setValue(false);
  hemisphereLightSettings.add(hemisphereLightHelper, 'visible').setValue(false).name('helper');
  hemisphereLightSettings.add(hemisphereLight, 'intensity', 0, 1).step(0.001);
  const hemisphereLightSettingsPos = hemisphereLightSettings.addFolder('Hemisphere Light Position');
  hemisphereLightSettingsPos.add(hemisphereLight.position, 'x', -10, 10).step(0.01).name('position x');
  hemisphereLightSettingsPos.add(hemisphereLight.position, 'y', -10, 10).step(0.01).name('position y');
  hemisphereLightSettingsPos.add(hemisphereLight.position, 'z', -10, 10).step(0.01).name('position z');
  hemisphereLightSettings.open();
  hemisphereLightSettingsPos.open();
}
// Point Light
{
  const pointLightSettings = gui.addFolder('Point Light');
  pointLightSettings.add(pointLight, 'visible').setValue(false);
  pointLightSettings.add(pointLightHelper, 'visible').setValue(false).name('helper');
  pointLightSettings.add(pointLight, 'intensity', 0, 1).step(0.001);
  pointLightSettings.add(pointLight, 'distance', 0, 100).step(0.1);
  pointLightSettings.add(pointLight, 'decay', 0, 2).step(0.1);
  const pointLightSettingsPos = pointLightSettings.addFolder('Point Light Position');
  pointLightSettingsPos.add(pointLight.position, 'x', -10, 10).step(0.01).setValue(2).name('position x');
  pointLightSettingsPos.add(pointLight.position, 'y', -10, 10).step(0.01).setValue(3).name('position y');
  pointLightSettingsPos.add(pointLight.position, 'z', -10, 10).step(0.01).setValue(4).name('position z');
  pointLightSettings.open();
  pointLightSettingsPos.open();
}
// RectArea Light
{
  const rectAreaLightSettings = gui.addFolder('RectArea Light');
  rectAreaLightSettings.add(rectAreaLight, 'visible').setValue(false);
  rectAreaLightSettings.add(rectAreaLightHelper, 'visible').setValue(false).name('helper');
  rectAreaLightSettings.add(rectAreaLight, 'intensity', 0, 1).step(0.001);
  rectAreaLightSettings.add(rectAreaLight, 'width', 1, 10).step(0.01).setValue(2);
  rectAreaLightSettings.add(rectAreaLight, 'height', 1, 10).step(0.01).setValue(2);
  const rectAreaLightSettingsPos = rectAreaLightSettings.addFolder('RectArea Light Position');
  rectAreaLightSettingsPos.add(rectAreaLight.position, 'x', -10, 10).step(0.01).setValue(-1.5).name('position x');
  rectAreaLightSettingsPos.add(rectAreaLight.position, 'y', -10, 10).step(0.01).setValue(0).name('position y');
  rectAreaLightSettingsPos.add(rectAreaLight.position, 'z', -10, 10).step(0.01).setValue(1.5).name('position z');
  rectAreaLightSettings.open();
  rectAreaLightSettingsPos.open();
}
// Spot Light
{
  const spotLightSettings = gui.addFolder('Spot Light');
  spotLightSettings.add(spotLight, 'visible').setValue(false);
  spotLightSettings.add(spotLightHelper, 'visible').setValue(false).name('helper');
  spotLightSettings.add(spotLight, 'intensity', 0, 1).step(0.001);
  spotLightSettings.add(spotLight, 'distance', 0, 100).step(0.001);
  spotLightSettings.add(spotLight, 'angle', -Math.PI * 2, Math.PI * 2).step(0.001);
  spotLightSettings.add(spotLight, 'penumbra', 0, 1).step(0.001);
  spotLightSettings.add(spotLight, 'decay', 0, 10).step(0.001);
  const spotLightSettingsPos = spotLightSettings.addFolder('SpotLight Position');
  spotLightSettingsPos.add(spotLight.position, 'x', -10, 10).step(0.01).setValue(0).name('position x');
  spotLightSettingsPos.add(spotLight.position, 'y', -10, 10).step(0.01).setValue(2).name('position y');
  spotLightSettingsPos.add(spotLight.position, 'z', -10, 10).step(0.01).setValue(3).name('position z');
  const spotLightSettingsTargetPos = spotLightSettings.addFolder('SpotLight Target Position');
  spotLightSettingsTargetPos.add(spotLight.target.position, 'x', -10, 10).step(0.01).name('target pos x');
  spotLightSettingsTargetPos.add(spotLight.target.position, 'y', -10, 10).step(0.01).name('target pos y');
  spotLightSettingsTargetPos.add(spotLight.target.position, 'z', -10, 10).step(0.01).name('target pos z');
  spotLightSettings.open();
  spotLightSettingsPos.open();
  spotLightSettingsTargetPos.open();
}