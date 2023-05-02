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
  ContactShadows,
  Sky,
  Environment,
  Lightformer,
} from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { useControls } from 'leva';

// softShadows({ frustum: 3.75, size: 0.005, near: 9.5, samples: 17, rings: 11 });

export default function Experience() {
  const cube = useRef(),
    dirLightRef = useRef();

  // Animation
  useFrame((state, delta) => {
    // const time = state.clock.elapsedTime;
    // cube.current.position.x = 2 + Math.sin(time);
    cube.current.rotation.y += delta * 0.2;
  });

  // Helper
  useHelper(dirLightRef, DirectionalLightHelper, 1);

  // GUI
  const { color, opacity, blur } = useControls('contact shadows', {
    color: { value: '#1d8f75' },
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  });
  const { sunPosition } = useControls('sky', {
    sunPosition: { value: [1, 2, 3] },
  });
  const { envMapIntensity } = useControls('environment map', {
    envMapIntensity: { value: 3.5, min: 2, max: 12 },
  });

  return (
    <>
      <Environment
        background
        // files={'./environmentMaps/the_sky_is_on_fire_2k.hdr'}
        preset='night'
        resolution={32}
      >
        <color args={['black']} attach='background' />
        {/* <mesh position={[0, 0, -5]} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color={[2, 0, 0]} />
        </mesh> */}
        <Lightformer
          position={[0, 0, -5]}
          scale={10}
          color='red'
          intensity={5}
          // form='ring'
        />
      </Environment>
      <BakeShadows />

      <Perf position='top-left' />

      <OrbitControls makeDefault />

      {/* <AccumulativeShadows position={[0, -0.99, 0]} scale={10} color='#316d39' opacity={0.8} frames={Infinity} temporal blend={100} >
        <RandomizedLight amount={8} radius={1} ambient={0.5} intensity={1} position={[1, 2, 3]} bias={0.001} />
      </AccumulativeShadows> */}

      <ContactShadows
        position={[0, -0.99, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
        frames={1}
      />

      {/* <directionalLight
        ref={dirLightRef}
        position={sunPosition}
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
      <ambientLight intensity={0.5} /> */}

      {/* <Sky sunPosition={sunPosition} /> */}

      <mesh position-x={-2} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color='orange' envMapIntensity={envMapIntensity} />
      </mesh>
      <mesh ref={cube} position-x={2} scale={1.5} castShadow>
        <boxGeometry />
        <meshStandardMaterial color='mediumpurple' envMapIntensity={envMapIntensity} />
      </mesh>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10} /*receiveShadow*/>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' envMapIntensity={envMapIntensity} />
      </mesh>
    </>
  );
}
