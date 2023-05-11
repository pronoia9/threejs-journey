import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Physics, RigidBody, Debug, CuboidCollider, BallCollider } from '@react-three/rapier';
import { Perf } from 'r3f-perf';

export default function Experience() {
  const cubeRef = useRef();

  const jump = (e, ref) => {
    ref.current.applyImpulse({ x: 0, y: 5, z: 0 });
    // ref.current.applyTorqueImpulse({ x: 0, y: 1, z: 0 });
    ref.current.applyTorqueImpulse({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 });
  };

  return (
    <>
      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Physics gravity={[0, -9.08, 0]}>
        <Debug />

        <RigidBody colliders='ball' gravityScale={0.9}>
          {/* <mesh castShadow position={[0, 4, 0]}> */}
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color='orange' />
          </mesh>
        </RigidBody>

        <RigidBody ref={cubeRef} gravityScale={1} restitution={0} friction={0.7}>
          <mesh castShadow position={[1.5, 2, 0]} onClick={(e) => jump(e, cubeRef)}>
            <boxGeometry />
            <meshStandardMaterial color='mediumpurple' />
          </mesh>
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
      </Physics>
    </>
  );
}
