import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';

import Experience from './Experience.jsx';
import { Interface } from './components';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
  <KeyboardControls
    map={[
      { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
      { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
      { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
      { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'jump', keys: ['Space'] },
    ]}
  >
    <Canvas shadows camera={{ fov: 45, near: 0.1, far: 200, position: [2.5, 4, 6] }}>
      <Experience />
    </Canvas>
    <Interface />
  </KeyboardControls>
);
