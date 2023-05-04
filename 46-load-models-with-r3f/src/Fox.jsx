import { useGLTF } from '@react-three/drei';

useGLTF.preload('./Fox/glTF/Fox.gltf');

export default function Fox() {
  const fox = useGLTF('./Fox/glTF/Fox.gltf');

  return (
    <>
      <primitive object={fox.scene} />
    </>
  );
}
