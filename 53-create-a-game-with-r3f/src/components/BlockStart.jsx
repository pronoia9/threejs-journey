import { geometries, materials } from "./utils";
const { floor1 } = materials;

export default function BlockStart({ position = [0, 0, 0], geometry = geometries.box, materials }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={geometry} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} material={materials?.floor || floor1} receiveShadow />
    </group>
  );
}
