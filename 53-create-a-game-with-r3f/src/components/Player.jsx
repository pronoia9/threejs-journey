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
    const impulseStrength = 0.6 * delta, torqueStrength = 0.2 * delta;

    // Keypresses
    if (forward) (impulse.z -= impulseStrength), (torque.x -= torqueStrength);
    if (rightward) (impulse.x += impulseStrength), (torque.z -= torqueStrength);
    if (backward) (impulse.z += impulseStrength), (torque.x += torqueStrength);
    if (leftward) (impulse.x -= impulseStrength), (torque.z += torqueStrength);

    // Apply movement
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
