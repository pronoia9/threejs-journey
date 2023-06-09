import { useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, useRapier } from '@react-three/rapier';

import useGame from '../stores/useGame';

export default function Player() {
  const playerRef = useRef(); // apply impulse + get position
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier(); // jump/ray
  const rapierWorld = world.raw(); // ray
  // lerping states
  const [smoothCameraPosition] = useState(new Vector3(10, 10, 10)),
    [smoothCameraTarget] = useState(new Vector3());
  // stores
  const blocksCount = useGame((state) => state.blocksCount),
    start = useGame((state) => state.start),
    end = useGame((state) => state.end),
    restart = useGame((state) => state.restart);

  // Jump
  const jump = () => {
    const origin = playerRef.current.translation(),
      direction = { x: 0, y: -1, z: 0 };
    origin.y -= 0.31;
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);
    if (hit.toi < 0.15) playerRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  };
  // Subscribe to jump key
  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      // Selector (listener)
      (state) => state.jump,
      // Function for when jump is pressed
      (value) => {
        if (value) jump();
      }
    );
    return () => {
      unsubscribeJump();
    };
  }, []);

  // Update store (Start phase)
  useEffect(() => {
    const unsubscribeAny = subscribeKeys(() => {
      start();
    });
    return () => {
      unsubscribeAny();
    };
  }, []);

  // Reset phase
  const reset = () => {
    playerRef.current.setTranslation({ x: 0, y: 1, z: 0 });
    playerRef.current.setLinvel({ x: 0, y: 1, z: 0 });
    playerRef.current.setAngvel({ x: 0, y: 1, z: 0 });
  };
  // Subscribe to store changes (Reset phase)
  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === 'ready') reset();
      }
    );
    return () => {
      unsubscribeReset();
    };
  }, []);

  // Frame
  useFrame((state, delta) => {
    // CONTROLS
    const { forward, rightward, backward, leftward } = getKeys();
    // Movement variables
    const impulse = { x: 0, y: 0, z: 0 },
      torque = { x: 0, y: 0, z: 0 };
    const impulseStrength = 0.6 * delta,
      torqueStrength = 0.2 * delta;
    // Keypresses
    if (forward) (impulse.z -= impulseStrength), (torque.x -= torqueStrength);
    if (rightward) (impulse.x += impulseStrength), (torque.z -= torqueStrength);
    if (backward) (impulse.z += impulseStrength), (torque.x += torqueStrength);
    if (leftward) (impulse.x -= impulseStrength), (torque.z += torqueStrength);
    // Apply movement
    playerRef.current.applyImpulse(impulse);
    playerRef.current.applyTorqueImpulse(torque);

    // CAMERA
    const playerPosition = playerRef.current.translation();
    // Position
    const cameraPosition = new Vector3();
    cameraPosition.copy(playerPosition);
    (cameraPosition.y += 0.65), (cameraPosition.z += 2.25);
    // Target
    const cameraTarget = new Vector3();
    cameraTarget.copy(playerPosition);
    cameraTarget.y += 0.25;
    // Lerping
    smoothCameraPosition.lerp(cameraPosition, 5 * delta), smoothCameraTarget.lerp(cameraTarget, 5 * delta);
    // Update camera
    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);

    // PHASES
    if (playerPosition.z < -(blocksCount * 4 + 2)) end();
    if (playerPosition.y < -4) restart();
  });

  return (
    <RigidBody ref={playerRef} colliders='ball' restitution={0.2} friction={1} linearDamping={0.5} angularDamping={0.5} position={[0, 1, 0]}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color='mediumpurple' />
      </mesh>
    </RigidBody>
  );
}
