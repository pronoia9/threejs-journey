export default function BlockStart({ position = [0, 0, 0], geometry, materials }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={geometry} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} material={materials.floor} receiveShadow />
    </group>
  );
}
