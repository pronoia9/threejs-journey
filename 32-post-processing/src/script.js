import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import * as dat from 'dat.gui';

/***   Base   ***/
// Debug
const gui = new dat.GUI();
const debug = {
  dotScreenPass: false,
  glitchPass: false,
  shaderPass: false,
  unrealBloomPass: false,
  smaaPass: false,
  tintShaderPass: false,
  displacementShaderPass: false,
  futuristicInterfaceDisplacementShaderPass: true,
};
const renderPassSettings = gui.addFolder('Render Passes');
renderPassSettings.open();
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();

/***   Loaders   ***/
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

/***   Environment map   ***/

/***   Environment map   ***/
const environmentMap = cubeTextureLoader.load(
  Array.from({ length: 6 }, (v, i) => `/textures/environmentMaps/0/${['px', 'nx', 'py', 'ny', 'pz', 'nz'][i]}.jpg`)
);
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
scene.environment = environmentMap;

/***   Models   ***/
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(2, 2, 2);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);
  updateAllMaterials();
});

/***   Lights   ***/
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
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
  // Update effect composer
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/***   Post processing   ***/
// Render target
let RenderTargetClass = null;
if (renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2)
  RenderTargetClass = THREE.WebGLMultisampleRenderTarget;
else RenderTargetClass = THREE.WebGLRenderTarget;
// Effect composer
const renderTarget = new RenderTargetClass(800, 600, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
  encoding: THREE.sRGBEncoding,
});
const effectComposer = new EffectComposer(renderer, renderTarget);
// Passes
const renderPass = addRenderPass();
const dotScreenPass = addDotScreenPass();
const glitchPass = addGlitchPass();
const shaderPass = addShaderPass();
const unrealBloomPass = addUnrealBloomPass({ strength: 0.3, radius: 1, threshold: 0.6 });
const smaaPass = addSMAAPass();
const tintShaderPass = addTintShaderPass();
const displacementShaderPass = addDisplacementShaderPass();
const futuristicInterfaceDisplacementShaderPass = addFuturisticInterfaceDisplacementShaderPass();
console.log(effectComposer.passes);

/***   Utils   ***/
// Update all materials
function updateAllMaterials() {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.material.envMapIntensity = 2.5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}
// Passes
function addRenderPass() {
  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);
  return renderPass;
}
function addDotScreenPass() {
  const dotScreenPass = new DotScreenPass();
  dotScreenPass.enabled = debug.dotScreenPass;
  effectComposer.addPass(dotScreenPass);
  return dotScreenPass;
}
function addGlitchPass() {
  const glitchPass = new GlitchPass();
  glitchPass.enabled = debug.glitchPass;
  // glitchPass.goWild = true;
  effectComposer.addPass(glitchPass);
  return glitchPass;
}
function addShaderPass() {
  const rgbShiftShader = new ShaderPass(RGBShiftShader);
  rgbShiftShader.enabled = debug.shaderPass;
  effectComposer.addPass(rgbShiftShader);
  return rgbShiftShader;
}
function addUnrealBloomPass(options) {
  const unrealBloomPass = new UnrealBloomPass();
  unrealBloomPass.enabled = debug.unrealBloomPass;
  if (options) {
    const { strength, radius, threshold } = options;
    strength && (unrealBloomPass.strength = strength);
    radius && (unrealBloomPass.radius = radius);
    threshold && (unrealBloomPass.threshold = threshold);
  }
  effectComposer.addPass(unrealBloomPass);
  return unrealBloomPass;
}
function addSMAAPass() {
  // enable smaa pass if the pixel ratior is 1 AND the browser doesnt support webgl 2
  if (!(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2)) return;
  const smaaPass = new SMAAPass();
  debug.smaaPass = true;
  smaaPass.enabled = true;
  effectComposer.addPass(smaaPass);
  return smaaPass;
}
function addTintShaderPass() {
  const tintShader = {
    vertexShader: `
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vUv = uv;
    }`,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uTint;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      color.rgb += uTint;
      gl_FragColor = color;
    }`,
    uniforms: {
      tDiffuse: { value: null },
      uTint: { value: null },
    },
  };
  const tintShaderPass = new ShaderPass(tintShader);
  tintShaderPass.material.uniforms.uTint.value = new THREE.Vector3(0.2, 0.0, 0.0);
  tintShaderPass.enabled = debug.tintShaderPass;
  effectComposer.addPass(tintShaderPass);
  return tintShaderPass;
}
function addDisplacementShaderPass() {
  const displacementShader = {
    vertexShader: `
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vUv = uv;
    }`,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec2 newUv = vec2(vUv.x, vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1);
      vec4 color = texture2D(tDiffuse, newUv);
      gl_FragColor = color;
    }`,
    uniforms: { tDiffuse: { value: null }, uTime: { value: null } },
  };
  const displacementShaderPass = new ShaderPass(displacementShader);
  displacementShaderPass.enabled = debug.displacementShaderPass;
  displacementShaderPass.material.uniforms.uTime.value = 0;
  effectComposer.addPass(displacementShaderPass);
  return displacementShaderPass;
}
function addFuturisticInterfaceDisplacementShaderPass() {
  const futuristicInterfaceDisplacementShader = {
    vertexShader: `
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vUv = uv;
    }`,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D uNormalMap;
    varying vec2 vUv;
    void main() {
      vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
      vec2 newUv = vUv + normalColor.xy * 0.1;
      vec4 color = texture2D(tDiffuse, newUv);

      vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
      float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
      color += lightness * 2.0;
      gl_FragColor = color;
    }`,
    uniforms: { tDiffuse: { value: null }, uNormalMap: { value: null } },
  };
  const futuristicInterfaceDisplacementShaderPass = new ShaderPass(futuristicInterfaceDisplacementShader);
  futuristicInterfaceDisplacementShaderPass.enabled = debug.futuristicInterfaceDisplacementShaderPass;
  futuristicInterfaceDisplacementShaderPass.material.uniforms.uNormalMap.value =
    textureLoader.load('/textures/interfaceNormalMap.png');
  effectComposer.addPass(futuristicInterfaceDisplacementShaderPass);
  return futuristicInterfaceDisplacementShaderPass;
}
// Animate
const clock = new THREE.Clock();
(function tick() {
  const elapsedTime = clock.getElapsedTime();
  // Update controls
  controls.update();
  // Update materials
  debug.displacementShaderPass && (displacementShaderPass.material.uniforms.uTime.value = elapsedTime);
  // Render
  // renderer.render(scene, camera);
  effectComposer.render();
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
})();

// DEBUG
renderPassSettings.add(debug, 'dotScreenPass').onChange(() => {
  dotScreenPass.enabled = !dotScreenPass.enabled;
  effectComposer.render();
});
renderPassSettings.add(debug, 'glitchPass').onChange(() => {
  glitchPass.enabled = !glitchPass.enabled;
  effectComposer.render();
});
renderPassSettings.add(debug, 'shaderPass').onChange(() => {
  shaderPass.enabled = !shaderPass.enabled;
  effectComposer.render();
});
renderPassSettings.add(debug, 'unrealBloomPass').onChange(() => {
  unrealBloomPass.enabled = !unrealBloomPass.enabled;
  effectComposer.render();
});
renderPassSettings.add(unrealBloomPass, 'strength', 0, 2, 0.001).name('unreal strength');
renderPassSettings.add(unrealBloomPass, 'radius', 0, 2, 0.001).name('unreal radius');
renderPassSettings.add(unrealBloomPass, 'threshold', 0, 1, 0.001).name('unreal threshold');
renderPassSettings.add(debug, 'smaaPass').onChange(() => {
  smaaPass.enabled = !smaaPass.enabled;
  effectComposer.render();
});
renderPassSettings.add(debug, 'tintShaderPass').onChange(() => {
  tintShaderPass.enabled = !tintShaderPass.enabled;
  effectComposer.render();
});
renderPassSettings.add(tintShaderPass.material.uniforms.uTint.value, 'x', -1, 1, 0.001).name('tint red');
renderPassSettings.add(tintShaderPass.material.uniforms.uTint.value, 'y', -1, 1, 0.001).name('tint blue');
renderPassSettings.add(tintShaderPass.material.uniforms.uTint.value, 'z', -1, 1, 0.001).name('tint green');
renderPassSettings.add(debug, 'displacementShaderPass').onChange(() => {
  displacementShaderPass.enabled = !displacementShaderPass.enabled;
  effectComposer.render();
});
renderPassSettings.add(debug, 'futuristicInterfaceDisplacementShaderPass').onChange(() => {
  futuristicInterfaceDisplacementShaderPass.enabled = !futuristicInterfaceDisplacementShaderPass.enabled;
  effectComposer.render();
});