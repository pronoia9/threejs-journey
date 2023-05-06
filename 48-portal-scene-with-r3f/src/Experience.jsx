import { OrbitControls, useGLTF, useTexture, Center } from '@react-three/drei';

export default function Experience() {
  const { nodes } = useGLTF('./model/portal.glb'),
    bakedTexture = useTexture('/model/baked.jpg');

  return (
    <>
      <color args={['#030202']} attach='background' />

      <OrbitControls makeDefault />

      <Center>
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} map-flipY={false} />
        </mesh>
      </Center>
    </>
  );
}
