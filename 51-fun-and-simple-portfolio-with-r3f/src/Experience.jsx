import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';
import { useControls } from 'leva';

export default function Experience() {
  const pc = useGLTF('./Desk.gltf');
  // console.log(pc);
  const { scale, position, rotation } = useControls('model', {
    scale: { value: 0.25 },
    position: { value: [0, 0, 0] },
    rotation: { value: [0, 0, 0] },
  });

  return (
    <>
      <Environment preset='city' />
      <color args={['#241a1a']} attach='background' />

      <OrbitControls makeDefault />

      <Float rotationIntensity={0.4}>
        <primitive object={pc.scene} scale={scale} position={position} rotation={rotation} />
      </Float>
    </>
  );
}
