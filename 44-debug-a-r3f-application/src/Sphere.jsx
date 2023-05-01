export default function Sphere({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = 'orange',
  visible,
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} visible={visible}>
      <sphereGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
