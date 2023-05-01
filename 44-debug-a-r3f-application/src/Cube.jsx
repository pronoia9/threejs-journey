export default function Cube({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color='mediumpurple' />
    </mesh>
  );
}
