import { useRef } from 'react';
import { DirectionalLightHelper } from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useHelper, BakeShadows } from '@react-three/drei';
import { Perf } from 'r3f-perf';

export default function Experience() {
  const cube = useRef(),
    dirLightRef = useRef();

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  useHelper(dirLightRef, DirectionalLightHelper, 1);

  return (
    <>
      <BakeShadows />

      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <directionalLight
        ref={dirLightRef}
        position={[1, 2, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={2}
        shadow-camera-right={2}
        shadow-camera-bottom={-2}
        shadow-camera-left={-2}
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

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10} receiveShadow>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
}
