import { useFrame } from '@react-three/fiber';

export default function App() {
  return (
    <group>
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry />
        <meshBasicMaterial color='orange' />
      </mesh>
      <mesh position={[2, 0, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5}>
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
