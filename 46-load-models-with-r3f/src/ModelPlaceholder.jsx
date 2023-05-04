const ModelPlaceholder = () => (
  <mesh position={[0, 0.5, 0]} scale={[2, 3, 2]}>
    <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
    <meshBasicMaterial wireframe color='red' />
  </mesh>
);

export default ModelPlaceholder;
