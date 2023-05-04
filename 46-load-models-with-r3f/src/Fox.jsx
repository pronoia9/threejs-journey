import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useAnimations } from '@react-three/drei';

useGLTF.preload('./Fox/glTF/Fox.gltf');

export default function Fox(props) {
  const fox = useGLTF('./Fox/glTF/Fox.gltf');
  const animations = useAnimations(fox.animations, fox.scene);

  useEffect(() => {
    animations.actions.Survey.play();
  }, []);

  return (
    <>
      <primitive object={fox.scene} {...props} />
    </>
  );
}
