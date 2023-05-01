import * as THREE from 'three';

export default function CustomObjects({ count }) {
  const verticesCount = count * 3; // need 3 verticies
  const positions = new Float32Array(verticesCount * 3); // each verticies need 3 values (x, y, z)
  for (let i = 0; i < verticesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 3;
  }

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute attach='attributes-position' count={verticesCount} itemSize={3} array={positions} />
      </bufferGeometry>
      <meshBasicMaterial color='red' side={THREE.DoubleSide} />
    </mesh>
  );
}
