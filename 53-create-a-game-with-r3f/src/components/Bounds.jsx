import { CuboidCollider, RigidBody } from '@react-three/rapier';

import { geometries, materials } from './utils';
const { wall } = materials;

export default function BlockStart({ length = 1, geometry = geometries.box, material }) {
  return (
    <RigidBody type='fixed' restitution={0.2} friction={0}>
      {/* Right Wall */}
      <mesh
        geometry={geometry}
        position={[2.15, 0.75, -((length * 4) / 2) + 4 / 2]}
        scale={[0.3, 1.9, length * 4]}
        material={material || wall}
        castShadow
      />
      {/* Left Wall */}
      <mesh
        geometry={geometry}
        position={[-2.15, 0.75, -((length * 4) / 2) + 4 / 2]}
        scale={[0.3, 1.9, length * 4]}
        material={material || wall}
        receiveShadow
      />
      {/* End Wall */}
      <mesh geometry={geometry} position={[0, 0.75, -(length * 4) + 4 / 2]} scale={[4.6, 1.9, 0.3]} material={material || wall} receiveShadow />
      {/* Floor */}
      <CuboidCollider args={[2, 0.1, 2 * length]} position={[0, -0.1, -((length * 4) / 2) + 4 / 2]} />
    </RigidBody>
  );
}
