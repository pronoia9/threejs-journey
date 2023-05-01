import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';

import Cube from './Cube';
import Sphere from './Sphere';

export default function Experience() {
  return (
    <>
      {/* Controls */}
      <OrbitControls makeDefault />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {/* Objects */}
      <Sphere />
      <Cube position={[2, 0, 0]} scale={1.5} />
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
}
