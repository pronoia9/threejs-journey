import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';

import ModelPlaceholder from './ModelPlaceholder';
import Hamburger from './Hamburger';
import Fox from './Fox';

export default function Experience() {
  return (
    <>
      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} shadow-normalBias={0.04} />
      <ambientLight intensity={0.5} />

      <mesh receiveShadow position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>

      <Suspense
        fallback={
          <ModelPlaceholder
            mesh={{ position: [0, 0.5, 0], scale: [2, 3, 2] }}
            geometry={{ args: [1, 1, 1, 2, 2, 2] }}
            material={{ wireframe: true, color: 'red' }}
          />
        }
      >
        <Hamburger scale={0.35} />
      </Suspense>
    </>
  );
}
