import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, useRapier } from '@react-three/rapier';
import { useEffect, useRef } from 'react';

export default function Player() {
  const bodyRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  // Jump
  const jump = () => {
    const origin = bodyRef.current.translation(), direction = { x: 0, y: -1, z: 0 };
    origin.y -= 0.31;
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);
    if (hit.toi < 0.15) bodyRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  }
  useEffect(() => {
    subscribeKeys(
      // Selector (listener)
      (state) => state.jump,
      // Function for when jump is pressed
      (value) => {
        if (value) jump();
       })
  }, []);

  useFrame((state, delta) => {
    const { forward, rightward, backward, leftward } = getKeys();
    // Movement variables
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
  });

  return (
    <RigidBody ref={bodyRef} colliders='ball' restitution={0.2} friction={1} linearDamping={0.5} angularDamping={0.5} position={[0, 1, 0]}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color='mediumpurple' />
      </mesh>
    </RigidBody>
  );
}
