import { Canvas } from '@react-three/fiber';

export default function App() {
  return (
    <Canvas>
      <mesh>
        <torusKnotGeometry />
        <meshNormalMaterial />
      </mesh>
    </Canvas>
  );
}
