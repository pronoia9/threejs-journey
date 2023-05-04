const ModelPlaceholder = ({ mesh, geometry, material }) => (
  <mesh {...mesh}>
    <boxGeometry {...geometry} />
    <meshBasicMaterial {...material} />
  </mesh>
);

export default ModelPlaceholder;
