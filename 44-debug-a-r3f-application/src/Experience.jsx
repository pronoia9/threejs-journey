import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';

import Cube from './Cube';
import Sphere from './Sphere';

export default function Experience() {
  const { spherePosition, sphereScale, sphereColor } = useControls({
    spherePosition: { value: { x: -2, y: 0 }, step: 0.01, joystick: 'invertY' },
    sphereScale: 1,
    sphereColor: '#ff0000',
  });

  return (
    <>
      {/* Controls */}
      <OrbitControls makeDefault />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {/* Objects */}
      <Sphere position={[...Object.values(spherePosition), 0]} scale={sphereScale} color={sphereColor} />
      <Cube position={[2, 0, 0]} scale={1.5} />
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
}
