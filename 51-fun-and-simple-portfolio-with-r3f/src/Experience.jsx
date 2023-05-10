import { Environment, Float, PresentationControls, ContactShadows } from '@react-three/drei';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';

import { Desk } from './Desk';

export default function Experience() {
  // Scene
  const { scale, position, rotation } = useControls('model', {
    scale: { value: 0.3 },
    position: { value: [0, -0.5, 0] },
    rotation: { value: [-0.1, -0.45, 0] },
  });

  // Controls
  const { polar, azimuth, config, mass, tension, snap } = useControls('presentation controls', {
    polar: { value: [-0.4, 0.2] },
    azimuth: { value: [-1, 0.75] },
    mass: { value: 2 },
    tension: { value: 200 },
    snap: { value: true },
  });

  return (
    <>
      <Perf position='top-left' />

      {/* <Environment preset='lobby' /> */}
      {/* sunset, dawn, night, warehouse, forest, apartment, studio, city, park, lobby */}

      <color args={['#2F2953']} attach='background' />

      <PresentationControls global rotation={[0.13, 0.1, 0]} polar={polar} azimuth={azimuth} config={{ mass, tension }} snap={snap}>
        <Float rotationIntensity={0.4}>
          {/* <primitive object={pc.scene} scale={scale} position={position} rotation={rotation} castShadow /> */}
          <Desk scale={scale} position={position} rotation={rotation} />
        </Float>
      </PresentationControls>

      <ContactShadows position={[0, -1.4, 0]} blur={2.4} />
    </>
  );
}
