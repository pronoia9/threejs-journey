import './style.css';
import ReactDOM from 'react-dom/client';
// import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

import Experience from './Experience.jsx';

const root = ReactDOM.createRoot(document.querySelector('#root'));

// const created = (state) => {
// console.log(state);
// state.gl.setClearColor('black', 0.75);
// state.scene.background = new THREE.Color('black');
// };

root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
    shadows
    // onCreated={created}
  >
    <color args={['black']} attach='background' />
    <Experience />
  </Canvas>
);
