import { useRef } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

extend({ OrbitControls });

export default function App() {
  const { camera, gl } = useThree(),
    cubeRef = useRef(),
    objsGroupRef = useRef();

  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta;
    // objsGroupRef.current.rotation.y += delta;
  });

  return (
    <group>
      {/* Camera */}
      <orbitControls args={[camera, gl.domElement]} />

      {/* Lights */}
      <directionalLight />

      {/* Meshes */}
      <group ref={objsGroupRef}>
        <mesh position={[-2, 0, 0]}>
          <sphereGeometry />
          <meshStandardMaterial color='orange' />
        </mesh>
        <mesh position={[2, 0, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5} ref={cubeRef}>
          <boxGeometry />
          <meshStandardMaterial color='purple' />
        </mesh>
      </group>
      <mesh position={[0, -1, 0]} rotation={[-Math.PI * 0.5, 0, 0]} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='green' />
      </mesh>
    </group>
  );
}
