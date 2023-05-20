import { Float, Text } from '@react-three/drei';

import { geometries, materials } from '../utils';
const { floor1 } = materials;

export default function BlockStart({ position = [0, 0, 0], geometry = geometries.box, material = floor1 }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={geometry} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} material={material} receiveShadow />
      {/* Text */}
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font='/bebas-neue-v9-latin-regular.woff'
          scale={0.4}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign='right'
          position={[0.75, 0.65, 0]}
          rotation={[0, -0.25, 0]}
        >
          Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
    </group>
  );
}
