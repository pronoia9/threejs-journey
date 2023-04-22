import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**   Base   **/
// Debug
const gui = new dat.GUI();
gui.close();
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();
// Fog
const fog = new THREE.Fog('#262837', 2, 15);
scene.fog = fog;

/**   Textures   **/
const textureLoader = new THREE.TextureLoader();
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg'),
  bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg'),
  bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg'),
  bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg'),
  doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg'),
  doorColorTexture = textureLoader.load('/textures/door/color.jpg'),
  doorHeightTexture = textureLoader.load('/textures/door/height.jpg'),
  doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg'),
  doorNormalTexture = textureLoader.load('/textures/door/normal.jpg'),
  doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg'),
  grassColorTexture = textureLoader.load('/textures/grass/color.jpg'),
  grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg'),
  grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');
const grassRepeat = 10;
grassColorTexture.repeat.set(grassRepeat, grassRepeat), grassColorTexture.repeat.set(grassRepeat, grassRepeat);
grassNormalTexture.repeat.set(grassRepeat, grassRepeat), grassRoughnessTexture.repeat.set(grassRepeat, grassRepeat);
(grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping),
  (grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping);
(grassColorTexture.wrapS = THREE.RepeatWrapping), (grassColorTexture.wrapT = THREE.RepeatWrapping);
(grassNormalTexture.wrapS = THREE.RepeatWrapping), (grassNormalTexture.wrapT = THREE.RepeatWrapping);
(grassRoughnessTexture.wrapS = THREE.RepeatWrapping), (grassRoughnessTexture.wrapT = THREE.RepeatWrapping);

/**   House   **/
const house = new THREE.Group();
scene.add(house);
// Walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughness: bricksRoughnessTexture,
  })
);
walls.position.set(0, 1.25, 0),
  walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)),
  (walls.castShadow = true),
  (walls.receiveShadow = true);
house.add(walls);
// Roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.position.set(0, 1.75 + 1.25, 0),
  roof.rotation.set(0, Math.PI * 0.25, 0),
  (roof.castShadow = true),
  (roof.receiveShadow = true);
house.add(roof);
// Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    // wireframe: true
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.position.set(0, 1, 2 + 0.01),
  door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
(door.castShadow = true), (door.receiveShadow = true);
house.add(door);
// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16),
  bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c894' });
const bushes = new Array(4).fill('').map((bush) => {
  bush = new THREE.Mesh(bushGeometry, bushMaterial);
  (bush.castShadow = true), (bush.receiveShadow = true);
  return bush;
});
bushes[0].position.set(0.8, 0.2, 2.2), bushes[0].scale.set(0.5, 0.5, 0.5);
bushes[1].position.set(1.4, 0.1, 2.1), bushes[1].scale.set(0.25, 0.25, 0.25);
bushes[2].position.set(-0.8, 0.1, 2.2), bushes[2].scale.set(0.4, 0.4, 0.4);
bushes[3].position.set(-1, 0.05, 2.6), bushes[3].scale.set(0.15, 0.15, 0.15);
house.add(...bushes);
// Graves
const graves = new THREE.Group();
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2),
  graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });
for (let i = 0; i < 50; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial),
    angle = Math.random() * Math.PI * 2,
    radius = 3 + Math.random() * 6;
  grave.position.set(Math.sin(angle) * radius, 0.3, Math.cos(angle) * radius);
  grave.rotation.set(0, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4);
  (grave.castShadow = true), (grave.receiveShadow = true);
  graves.add(grave);
}
scene.add(graves);
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassNormalTexture,
  })
);
floor.rotation.set(-Math.PI * 0.5, 0, 0),
  floor.position.set(0, 0, 0),
  floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));
floor.receiveShadow = true;
scene.add(floor);

/**   Lights   **/
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff');
{
  const ambientLightSettings = gui.addFolder('AMBIENT LIGHT SETTINGS');
  ambientLightSettings.add(ambientLight, 'visible').setValue(true);
  ambientLightSettings.add(ambientLight, 'intensity', 0, 1, 0.001).setValue(0.12);
  ambientLightSettings.open();
}
// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff');
{
  const moonlightSettings = gui.addFolder('MOONLIGHT SETTINGS');
  moonlightSettings.add(moonLight, 'visible').setValue(true);
  moonlightSettings.add(moonLight, 'intensity', 0, 1, 0.001).setValue(0.12);
  moonlightSettings.add(moonLight.position, 'x', -5, 5, 0.001).name('pos x').setValue(4);
  moonlightSettings.add(moonLight.position, 'y', -5, 5, 0.001).name('pos y').setValue(5);
  moonlightSettings.add(moonLight.position, 'z', -5, 5, 0.001).name('pos z').setValue(-2);
  moonlightSettings.add(moonLight, 'castShadow').name('cast shadow').setValue(true);
  moonlightSettings.add(moonLight.shadow, 'radius', 0, 100).name('shadow blur').step(0.01);
  moonlightSettings.open();
}
// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.shadow.mapSize.set(256, 256), (doorLight.shadow.camera.far = 7);
{
  const doorLightSettings = gui.addFolder('DOOR LIGHT SETTINGS');
  doorLightSettings.add(doorLight, 'visible').setValue(true);
  doorLightSettings.add(doorLight, 'intensity', 0, 1, 0.001).setValue(0.75);
  doorLightSettings.add(doorLight, 'distance');
  doorLightSettings.add(doorLight.position, 'x', -5, 5, 0.001).name('pos x').setValue(0);
  doorLightSettings.add(doorLight.position, 'y', -5, 5, 0.001).name('pos y').setValue(2.2);
  doorLightSettings.add(doorLight.position, 'z', -5, 5, 0.001).name('pos z').setValue(2.7);
  doorLightSettings.add(doorLight, 'castShadow').name('cast shadow').setValue(true);
  doorLightSettings.open();
}
// Ghosts
const ghosts = ['', '', ''].map((ghost, i) => {
  ghost = new THREE.PointLight(['#ff00ff', '#00ff00', '#0000ff'][i], 2, 3);
  (ghost.castShadow = true), ghost.shadow.mapSize.set(256, 256), (ghost.shadow.camera.far = 7);
  return ghost;
});
scene.add(ambientLight, moonLight, doorLight, ...ghosts);

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
camera.position.set(4, 2, 3);
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**   Renderer   **/
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
{
  const rendererSettings = gui.addFolder('RENDERER SETTINGS');
  rendererSettings.add(renderer.shadowMap, 'enabled').name('shadow map').setValue(true);
  rendererSettings.open();
}

/**   Animate   **/
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Animate ghosts
  const ghostAngles = [elapsedTime * 0.5, -elapsedTime * 0.32, elapsedTime * 0.18],
    ghostSpeed = [3, 4, 4],
    ghostRadius = [4, 5, 7];
  ghosts.forEach((ghost, i) => {
    ghost.position.set(
      Math.cos(ghostAngles[i]) * (ghostRadius[i] + Math.sin(elapsedTime * (i * 0.32 + 0.32))),
      Math.sin(elapsedTime * ghostSpeed[i]) + Math.sin(elapsedTime * i * 1.25),
      Math.sin(ghostAngles[i]) * (ghostRadius[i] + Math.sin(elapsedTime * 2.5))
    );
  });
  {
    // ghosts[0].position.set(
    //   Math.cos(ghostAngles[0]) * ghostRadius[0],
    //   Math.sin(elapsedTime * ghostSpeed[0]) + Math.sin(elapsedTime * 0),
    //   Math.sin(ghostAngles[0]) * ghostRadius[0]
    // );
    // ghosts[1].position.set(
    //   Math.cos(ghostAngles[1]) * ghostRadius[1],
    //   Math.sin(elapsedTime * ghostSpeed[1]) + Math.sin(elapsedTime * 2.5),
    //   Math.sin(ghostAngles[1]) * ghostRadius[1]
    // );
    // ghosts[2].position.set(
    //   Math.cos(ghostAngles[2]) * (ghostRadius[2] + Math.sin(elapsedTime * 0.32)),
    //   Math.sin(elapsedTime * ghostSpeed[2]) + Math.sin(elapsedTime * 1.25),
    //   Math.sin(ghostAngles[2]) * (ghostRadius[2] + Math.sin(elapsedTime * 0.32))
    // );
  }
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
