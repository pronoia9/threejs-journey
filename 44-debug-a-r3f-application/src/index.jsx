import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Leva } from 'leva';
import { Canvas } from '@react-three/fiber';

import './style.css';
import Experience from './Experience.jsx';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
  <StrictMode>
    <Leva collapsed />
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Experience />
    </Canvas>
  </StrictMode>
);
