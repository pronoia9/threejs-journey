import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';

export default function Experience() {
  const pc = useGLTF('./Desk.gltf');
  // console.log(pc);
  const { scale, position, rotation } = useControls('model', {
    scale: { value: 0.3 },
    position: { value: [0, -0.5, 0] },
    rotation: { value: [-0.1, -0.45, 0] },
  });

  return (
    <>
      <Perf position='top-left' />

      <Environment preset='night' />
      <color args={['#2F2953']} attach='background' />

      <PresentationControls global rotation={[0.13, 0.1, 0]} polar={[-0.4, 0.2]} azimuth={[-1, 0.75]}>
        <Float rotationIntensity={0.4}>
          <primitive object={pc.scene} scale={scale} position={position} rotation={rotation} />
        </Float>
      </PresentationControls>
    </>
  );
}
