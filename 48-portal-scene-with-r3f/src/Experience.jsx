import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';

export default function Experience() {
  const { nodes } = useGLTF('./model/portal.glb'),
    bakedTexture = useTexture('/model/baked.jpg');
  console.log(nodes, bakedTexture);

  return (
    <>
      <color args={['#030202']} attach='background' />

      <OrbitControls makeDefault />

      <mesh geometry={nodes.baked.geometry} />
    </>
  );
}
