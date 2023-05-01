export default function CustomObjects({ count }) {
  const verticesCount = count * 3; // need 3 verticies
  const positions = new Float32Array(verticesCount * 3); // each verticies need 3 values (x, y, z)

  return (
    <mesh>
      <boxGeometry />
      <meshNormalMaterial />
    </mesh>
  );
}
