import { useRef } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import CustomObjects from './CustomObjects';

extend({ OrbitControls });

export default function App() {
  const { camera, gl } = useThree(),
    cubeRef = useRef(),
    objsGroupRef = useRef();

  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta;
    // objsGroupRef.current.rotation.y += delta;

    // const angle = state.clock.elapsedTime;
    // state.camera.position.x = Math.sin(angle) * 5;
    // state.camera.position.z = Math.cos(angle) * 5;
    // state.camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      {/* Camera */}
      <orbitControls args={[camera, gl.domElement]} />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {/* Meshes */}
      <group ref={objsGroupRef}>
        <mesh position={[-2, 0, 0]}>
          <sphereGeometry />
          <meshStandardMaterial color='navy' />
        </mesh>
        <mesh position={[2, 0, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5} ref={cubeRef}>
          <boxGeometry />
          <meshStandardMaterial color='hotpink' />
        </mesh>
      </group>
      <mesh position={[0, -1, 0]} rotation={[-Math.PI * 0.5, 0, 0]} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='indigo' />
      </mesh>
      <CustomObjects count={10} />
    </group>
  );
}
