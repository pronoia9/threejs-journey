export default function Sphere({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = 'orange' }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <sphereGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
