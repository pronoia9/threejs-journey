export default function BlockEnd({ position = [0, 0, 0] }) {
  const hamburger = useGLTF('/hamburger.glb');
  hamburger.scene.children.forEach((child) => {
    child.type === 'Mesh' && (child.castShadow = true);
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={boxGeometry} position={[0, -0.05, 0]} scale={[4, 0.3, 4]} material={floor1Material} receiveShadow />
      {/* Burger */}
      <RigidBody type='fixed' colliders='hull' position={[0, 0.25, 0]} restitution={0.2} friction={0}>
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
}
