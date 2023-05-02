import { useRef } from 'react';
import { DirectionalLightHelper } from 'three';
import { useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  useHelper,
  BakeShadows,
  softShadows,
  AccumulativeShadows,
  RandomizedLight,
} from '@react-three/drei';
import { Perf } from 'r3f-perf';

// softShadows({ frustum: 3.75, size: 0.005, near: 9.5, samples: 17, rings: 11 });

export default function Experience() {
  const cube = useRef(),
    dirLightRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    cube.current.position.x = 2 + Math.sin(time);
    cube.current.rotation.y += delta * 0.2;
  });

  useHelper(dirLightRef, DirectionalLightHelper, 1);

  return (
    <>
      {/* <BakeShadows /> */}

      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <AccumulativeShadows
        position={[0, -0.99, 0]}
        scale={10}
        color='#316d39'
        opacity={0.8}
        frames={Infinity}
        temporal
        blend={100}
      >
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={1}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows>

      <directionalLight
        ref={dirLightRef}
        position={[1, 2, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
      <ambientLight intensity={0.5} />

      <mesh position-x={-2} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color='orange' />
      </mesh>

      <mesh ref={cube} position-x={2} scale={1.5} castShadow>
        <boxGeometry />
        <meshStandardMaterial color='mediumpurple' />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10} /*receiveShadow*/>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
}
