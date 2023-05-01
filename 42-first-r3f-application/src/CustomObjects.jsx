import { useRef, useMemo, useEffect } from 'react';
import { DoubleSide } from 'three';

export default function CustomObjects({ count }) {
  const geometryRef = useRef();
  const verticesCount = count * 3; // need 3 verticies
  const positions = useMemo(() => {
    const positions = new Float32Array(verticesCount * 3); // each verticies need 3 values (x, y, z)
    for (let i = 0; i < verticesCount * 3; i++) positions[i] = (Math.random() - 0.5) * 3;
    return positions;
  }, []);

  useEffect(() => {
    // geometryRef.current.computeVertextNormals();
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach='attributes-position' count={verticesCount} itemSize={3} array={positions} />
      </bufferGeometry>
      <meshBasicMaterial color='red' side={DoubleSide} />
    </mesh>
  );
}
