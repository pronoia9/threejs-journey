import './style.css';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

import App from './App';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
  <Canvas
    // orthographic
    // flat
    // dpr={[1, 2]}
    // gl={{ antialias: false, toneMapping: THREE.CineonToneMapping, outputEncoding: THREE.LinearEncoding }}
    camera={{ fov: 45, /* zoom: 100, */ near: 0.1, far: 200, position: [3, 2, 6] }}
  >
    <App />
  </Canvas>
);
