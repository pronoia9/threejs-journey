import { useRef } from 'react';
import { OrbitControls, TransformControls } from '@react-three/drei';

export default function Experience() {
  const cubeRef = useRef();

  return (
    <group>
      {/* Controls */}
      {/* <OrbitControls /> */}

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {/* Objects */}
      <group>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color='orange' />
        </mesh>

        <mesh position-x={2} scale={1.5} ref={cubeRef}>
          <boxGeometry />
          <meshStandardMaterial color='mediumpurple' />
        </mesh>
        <TransformControls object={cubeRef} />

        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
          <meshStandardMaterial color='greenyellow' />
        </mesh>
      </group>
    </group>
  );
}
