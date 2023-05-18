import { geometries, materials } from './utils';
const { wall } = materials;

export default function BlockStart({ length = 1, geometry = geometries.box, material }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Right Wall */}
      <mesh geometry={geometry} position={[2.15, 0.75, -(length * 4 / 2) + (4 / 2)]} scale={[0.3, 1.9, length * 4]} material={material || wall} castShadow />
      {/* Left Wall */}
      <mesh geometry={geometry} position={[-2.15, 0.75, -(length * 4 / 2) + (4 / 2)]} scale={[0.3, 1.9, length * 4]} material={material || wall} receiveShadow />
      {/* End Wall */}
      <mesh geometry={geometry} position={[0, 0.75, -(length * 4) + (4 / 2)]} scale={[4.6, 1.9, 0.3]} material={material || wall} receiveShadow />
    </group>
  );
}
