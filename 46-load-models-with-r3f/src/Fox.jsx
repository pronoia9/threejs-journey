import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useAnimations } from '@react-three/drei';
import { useControls } from 'leva';

useGLTF.preload('./Fox/glTF/Fox.gltf');

export default function Fox(props) {
  const fox = useGLTF('./Fox/glTF/Fox.gltf');
  const animations = useAnimations(fox.animations, fox.scene);

  const { currAnimation } = useControls('fox animations', {
    currAnimation: { options: [...animations.names] },
  });

  useEffect(() => {
    const action = animations.actions[currAnimation];
    action.reset().fadeIn(0.5).play();

    return () => {
      action.fadeOut(0.5);
    };
  }, [currAnimation]);

  return (
    <>
      <primitive object={fox.scene} {...props} />
    </>
  );
}
