import { geometries, materials } from "./utils";
const { floor1 } = materials;

export default function BlockStart({ position = [0, 0, 0], geometry = geometries.box, material = floor1 }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={geometry} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} material={material} receiveShadow />
    </group>
  );
}
