import { useGLTF } from '@react-three/drei';

useGLTF.preload('./Fox/glTF-Binary/Fox.glb');

export default function Fox() {
  const fox = useGLTF('./Fox/glTF-Binary/Fox.glb');

  return <></>;
}
