import { useGLTF } from '@react-three/drei';

useGLTF.preload('./hamburger-draco.glb');
export default function Model() {
  const hamburger = useGLTF('./hamburger-draco.glb');

  return (
    <>
      <primitive object={hamburger.scene} scale={0.35} />
    </>
  );
}
