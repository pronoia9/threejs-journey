import { useGLTF, Clone } from '@react-three/drei';

useGLTF.preload('./hamburger-draco.glb');

export default function Model() {
  const model = useGLTF('./hamburger-draco.glb');

  return (
    <>
      <Clone object={model.scene} scale={0.35} position={[-4, 0, 0]} />
      <Clone object={model.scene} scale={0.35} position={[0, 0, 0]} />
      <Clone object={model.scene} scale={0.35} position={[4, 0, 0]} />
    </>
  );
}
