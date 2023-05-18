import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

import { geometries, materials } from './utils';
const { floor1 } = materials;

export default function BlockEnd({ position = [0, 0, 0], geometry = geometries.box, materials = floor1 }) {
  const hamburger = useGLTF('/hamburger.glb');
  hamburger.scene.children.forEach((child) => {
    child.type === 'Mesh' && (child.castShadow = true);
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={geometry} position={[0, -0.05, 0]} scale={[4, 0.3, 4]} material={materials?.floor || materials} receiveShadow />
      {/* Burger */}
      <RigidBody type='fixed' colliders='hull' position={[0, 0.25, 0]} restitution={0.2} friction={0}>
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
}
