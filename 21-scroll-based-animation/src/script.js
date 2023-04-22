import './style.css';
import * as THREE from 'three';
import * as dat from 'lil-gui';
import gsap from 'gsap';
// blue: 08D9D6 | black: 252A34 | red: FF2E63 | white: EAEAEA

/***   Debug   ***/
const gui = new dat.GUI();
const parameters = {
  materialColor: '#FF2E63',
  particleCount: 500,
  particleTexture: 7, //Math.floor(Math.random() * 13)
  particleSize: 0.09,
  particleVertexColor: false,
  particleColor: '#EAEAEA',
};
gui.addColor(parameters, 'materialColor').onChange(() => material.color.set(parameters.materialColor));

/***   Base   ***/
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/***   Objects   ***/
// Texture
const textureLoader = new THREE.TextureLoader();
const gradients = {
  three: textureLoader.load('/textures/gradients/3.jpg'),
  five: textureLoader.load('/textures/gradients/5.jpg'),
};
// Set the magFilter of the tecture THREE.NearestFilter to make it more cartoonish shading
Object.entries(gradients).forEach((gradient) => {
  gradient[1].magFilter = THREE.NearestFilter;
});
const particleTextures = new Array(13)
  .fill('')
  .map((texture, i) => (texture = textureLoader.load(`/textures/particles/${i + 1}.png`)));

// Material
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor, gradientMap: gradients.five });

// Meshes
const objectsDistance = 4;
const objects = [
  new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material),
  new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material),
  new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material),
];
objects.map((obj, i) => obj.position.set(i % 2 ? -2 : 2, -objectsDistance * i, obj.position.z));
scene.add(...objects);

/***   Particles   ***/
let particleGeometry, particleMaterial, particles;
const generateParticles = () => {
  // Destrol old particles
  if (particles) particleGeometry.dispose(), material.dispose(), scene.remove(particles);
  // Geometry attributes / calculations
  const positions = new Float32Array(Array.from({ length: parameters.particleCount * 3 }, () => 0)),
    colors = new Float32Array(Array.from({ length: parameters.particleCount * 3 }, () => Math.random()));
  for (let i = 0; i < parameters.particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * objects.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  // Geometry
  particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  // Materies
  particleMaterial = new THREE.PointsMaterial({
    size: parameters.particleSize,
    sizeAttenuation: true,
    alphaMap: particleTextures[parameters.particleTexture],
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: new THREE.Color(parameters.particleColor),
    vertexColors: parameters.particleVertexColor,
  });
  // Particles
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
};
generateParticles();
gui.add(parameters, 'particleSize', 0, 1, 0.01).name('particle size').onChange(generateParticles);
gui.add(parameters, 'particleCount', 100, 1000).name('particle count').onFinishChange(generateParticles);
gui.add(parameters, 'particleTexture', 0, 13, 1).name('particle texture').onChange(generateParticles);
gui.add(parameters, 'particleVertexColor').name('particle rainbow').onChange(generateParticles);
gui.addColor(parameters, 'particleColor').name('particle color').onChange(generateParticles);

/***   Lights   ***/
const directionalLight = new THREE.DirectionalLight('#fff');
directionalLight.position.set(1, 1, 0);
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
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);

/***   Renderer   ***/
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor(new THREE.Color('black'), 0.5);

/***   Scroll   ***/
let scrollY = window.scrollY,
  currentSection = 0;
window.addEventListener('scroll', (e) => {
  scrollY = window.scrollY;
  // console.log({ scrollY: scrollY, cameraY: camera.position.y });
  // Math.floor(scrollY / sizes.height); // perfectly gets when the new section is right in the middle of the viewport
  const newSection = Math.round(scrollY / sizes.height);
  // console.log(Math.floor(newSection));
  if (newSection !== currentSection) {
    currentSection = newSection;
    // console.log('changed section', currentSection);
    gsap.to(objects[currentSection].rotation, { duration: 1.5, ease: 'power2.inOut', x: '+=6', y: '+=3', z: '+=1.5' })
  }
});

/***   Cursor   ***/
const cursor = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  (cursor.x = e.clientX / sizes.width - 0.5), (cursor.y = e.clientY / sizes.height - 0.5);
  // console.log(cursor);
});

/***   Animate   ***/
const clock = new THREE.Clock();
let prevTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime(),
    deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  // Animate camera
  camera.position.y = -((scrollY / sizes.height) * objectsDistance);
  const parallaxX = cursor.x,
    parallaxY = -cursor.y;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.5 * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.5 * deltaTime;

  // Animate meshes
  for (const obj of objects) {
    obj.rotation.x += deltaTime * 0.1;
    obj.rotation.y += deltaTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
