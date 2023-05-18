import { geometries, materials } from './utils';
const { wall } = materials;

export default function BlockStart({ length = 1, geometry = geometries.box, materials }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh geometry={geometry} scale={[4, 0.2, 4]} material={materials?.floor || wall} receiveShadow />
    </group>
  );
}
