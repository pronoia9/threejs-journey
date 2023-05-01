import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';

import Cube from './Cube';
import Sphere from './Sphere';

export default function Experience() {
  const { sPosition, sScale, sColor, sVisibility } = useControls('sphere', {
    sPosition: { value: { x: -2, y: 0 }, step: 0.01, joystick: 'invertY' },
    sScale: 1,
    sColor: '#ff0000',
    sVisibility: true,
  });
  const { cScale } = useControls('cube', {
    cScale: { value: 1.5, min: 0, max: 5, step: 0.01 },
  });

  return (
    <>
      {/* Controls */}
      <OrbitControls makeDefault />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {/* Objects */}
      <Sphere
        position={[...Object.values(sPosition), 0]}
        scale={sScale}
        color={sColor}
        visible={sVisibility}
      />
      <Cube position={[2, 0, 0]} scale={cScale} />
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
}
