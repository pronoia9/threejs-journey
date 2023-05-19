import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useRef } from 'react';

export default function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const bodyRef = useRef();

  useFrame((state, delta) => {
    const { forward, rightward, backward, leftward } = getKeys();
    
    const impulse = { x: 0, y: 0, z: 0 }, torque = { x: 0, y: 0, z: 0 };
    const impulseStrength = 1 * delta, torqueStrength = 1 * delta;

    if (forward) impulse.z -= impulseStrength;

    bodyRef.current.applyImpulse(impulse);
    bodyRef.current.applyTorqueImpulse(torque);
  })

  return (
    <RigidBody ref={bodyRef} colliders='ball' restitution={0.2} friction={1} position={[0, 1, 0]}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color='mediumpurple' />
      </mesh>
    </RigidBody>
  );
}
