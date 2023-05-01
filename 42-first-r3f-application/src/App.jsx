import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function App() {
  const cubeRef = useRef();
  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta;
  });

  return (
    <group>
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry />
        <meshBasicMaterial color='orange' />
      </mesh>
      <mesh position={[2, 0, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5} ref={cubeRef}>
        <boxGeometry />
        <meshBasicMaterial color='purple' />
      </mesh>
      <mesh position={[0, -1, 0]} rotation={[-Math.PI * 0.5, 0, 0]} scale={10}>
        <planeGeometry />
        <meshBasicMaterial color='green' />
      </mesh>
    </group>
  );
}
