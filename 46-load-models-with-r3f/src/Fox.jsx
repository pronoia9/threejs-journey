import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useAnimations } from '@react-three/drei';

useGLTF.preload('./Fox/glTF/Fox.gltf');

export default function Fox(props) {
  const fox = useGLTF('./Fox/glTF/Fox.gltf');
  const animations = useAnimations(fox.animations, fox.scene);

  useEffect(() => {
    // animations.actions.Survey.play();
    animations.actions.Run.play();
    setTimeout(() => {
      animations.actions.Walk.play();
      animations.actions.Survey.crossFadeFrom(animations.actions.Run, 1);
    }, 2000);
  }, []);

  return (
    <>
      <primitive object={fox.scene} {...props} />
    </>
  );
}
