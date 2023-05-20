import { useGLTF, Float, Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

import { geometries, materials } from './utils';
const { floor1 } = materials;

export default function BlockEnd({ position = [0, 0, 0], geometry = geometries.box, material = floor1 }) {
  const hamburger = useGLTF('/hamburger.glb');
  hamburger.scene.children.forEach((child) => {
    child.type === 'Mesh' && (child.castShadow = true);
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={geometry} position={[0, -0.05, 0]} scale={[4, 0.3, 4]} material={material} receiveShadow />
      {/* Burger */}
      <RigidBody type='fixed' colliders='hull' position={[0, 0.25, 0]} restitution={0.2} friction={0}>
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
      {/* Text */}
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text font='/bebas-neue-v9-latin-regular.woff' scale={0.8} position={[0, 2.25, 2]}>
          FINISH
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
    </group>
  );
}
