import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Physics, RigidBody, Debug, CuboidCollider, BallCollider, CylinderCollider, InstancedRigidBodies } from '@react-three/rapier';
import { Euler, Quaternion, Matrix4, Vector3 } from 'three';
import { Perf } from 'r3f-perf';

export default function Experience() {
  const [hitSound, setHitSound] = useState(() => new Audio('./hit.mp3'));
  const cubeRef = useRef(),
    twisterRef = useRef(),
    cubesRef = useRef();
  const burger = useGLTF('./hamburger.glb');
  const cubesCount = 300;
  const cubesTransforms = useMemo(() => {
    const positions = [];
    const rotations = [];
    const scales = [];
    for (let i = 0; i < cubesCount; i++) {
      positions.push([(Math.random() - 0.5) * 8, 6 + i * 0.2, (Math.random() - 0.5) * 8]);
      rotations.push([Math.random(), Math.random(), Math.random()]);
      const scale = 0.2 + Math.random() * 0.8;
      scales.push([scale, scale, scale]);
    }
    return { positions, rotations, scales };
  }, []);

  const jump = (e, ref) => {
    ref.current.applyImpulse({ x: 0, y: 5 * ref.current.mass(), z: 0 });
    // ref.current.applyTorqueImpulse({ x: 0, y: 1, z: 0 });
    ref.current.applyTorqueImpulse({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 });
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const eulerRotation = new Euler(0, time * 3, 0),
      quaternionRotation = new Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);
    twisterRef.current.setNextKinematicRotation(quaternionRotation);

    const angle = time * 0.5;
    const x = Math.cos(angle) * 2,
      z = Math.sin(angle) * 2;
    twisterRef.current.setNextKinematicTranslation({ x, y: -0.8, z });
  });

  const collisionEnter = () => {
    // hitSound.currentTime = 0;
    // hitSound.volume = Math.random();
    // hitSound.play();
  };

  useEffect(() => {
    for (let i = 0; i < cubesCount; i++) {
      const matrix = new Matrix4();
      matrix.compose(new Vector3(i * 2, 0, 0), new Quaternion(), new Vector3(1, 1, 1));
      cubesRef.current.setMatrixAt(i, matrix);
    }
  }, []);

  return (
    <>
      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Physics gravity={[0, -9.08, 0]}>
        {/* <Debug /> */}

        <RigidBody colliders='ball' gravityScale={0.9}>
          {/* <mesh castShadow position={[0, 4, 0]}> */}
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color='orange' />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={cubeRef}
          position={[1.5, 2, 0]}
          gravityScale={1}
          restitution={0}
          friction={0.7}
          colliders={false}
          onCollisionEnter={collisionEnter}
          // onCollisionExit={() => { console.log('collision exit'); }}
          // onSleep={() => {  console.log('sleep'); }}
          // onWake={() => {  console.log('wake'); }}
        >
          <mesh castShadow onClick={(e) => jump(e, cubeRef)}>
            <boxGeometry />
            <meshStandardMaterial color='mediumpurple' />
          </mesh>
          <CuboidCollider args={[0.5, 0.5, 0.5]} mass={2} />
        </RigidBody>

        {/* <RigidBody colliders={false} position={[0, 1, 0]} rotation={[Math.PI * 0.5, 0, 0]}> */}
        {/* <CuboidCollider args={[1.5, 1.5, 0.5]} /> */}
        {/* <CuboidCollider args={[0.25, 1, 0.25]} position={[0, 0, 1]} rotation={[-Math.PI * 0.35, 0, 0]} /> */}
        {/* <BallCollider args={[1.5]} /> */}
        {/* <mesh castShadow>
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color='mediumpurple' />
          </mesh> */}
        {/* </RigidBody> */}

        <RigidBody type='fixed' restitution={0} friction={0.7}>
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color='greenyellow' />
          </mesh>
        </RigidBody>

        <RigidBody ref={twisterRef} type='kinematicPosition' position={[0, -0.8, 0]} friction={0}>
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color='#ff0000' />
          </mesh>
        </RigidBody>

        <RigidBody position={[0, 4, 0]} colliders={false}>
          <CylinderCollider args={[0.5, 1.25]} />
          <primitive object={burger.scene} scale={0.25} />
        </RigidBody>

        {/* Invisible Walls */}
        <RigidBody type='fixed'>
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>

        <InstancedRigidBodies positions={cubesTransforms.positions} rotations={cubesTransforms.rotations} scale={cubesTransforms.scales}>
          <instancedMesh ref={cubesRef} args={[null, null, cubesCount]} castShadow>
            <boxGeometry />
            <meshNormalMaterial />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
}
