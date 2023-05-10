import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';

export default function Experience() {
  const pc = useGLTF('./Desk.gltf');
  // console.log(pc);
  const { scale, position, rotation } = useControls('model', {
    scale: { value: 0.25 },
    position: { value: [0, -0.5, 0] },
    rotation: { value: [0, 0, 0] },
  });

  return (
    <>
      <Perf position='top-left' />

      <Environment preset='city' />
      <color args={['#2F2953']} attach='background' />

      <PresentationControls global>
        <Float rotationIntensity={0.4}>
          <primitive object={pc.scene} scale={scale} position={position} rotation={rotation} />
        </Float>
      </PresentationControls>
    </>
  );
}
