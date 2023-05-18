import { useRef, useState } from 'react';
import { Euler, Quaternion } from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

import { geometries, materials } from './utils';
const { wall } = materials;

export default function BlockSpinner({ position = [0, 0, 0], geometry = geometries.box, materials = wall }) {
  const [spin] = useState((Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1));
  const obstacleRef = useRef();

  // Animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Rotation of the obstacle
    const rotation = new Quaternion();
    rotation.setFromEuler(new Euler(0, time * spin, 0));
    obstacleRef.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={geometry} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} material={materials?.floor} receiveShadow />
      {/* Obstacle */}
      <RigidBody ref={obstacleRef} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
        <mesh geometry={geometry} position={[0, 0, 0]} scale={[3.5, 0.3, 0.3]} material={materials?.obstacle} castShadow receiveShadow />
      </RigidBody>
    </group>
  );
}
