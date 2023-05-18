import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

export default function BlockLimbo({ position = [0, 0, 0] }) {
  const [offset] = useState(Math.random() * Math.PI * 2);
  const obstacleRef = useRef();

  // Animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time + offset) + 1.15;
    obstacleRef.current.setNextKinematicTranslation({ x: position[0], y, z: position[2] });
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={boxGeometry} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} material={floor2Material} receiveShadow />
      {/* Obstacle */}
      <RigidBody ref={obstacleRef} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
        <mesh geometry={boxGeometry} position={[0, 0, 0]} scale={[3.5, 0.3, 0.3]} material={obstacleMaterial} castShadow receiveShadow />
      </RigidBody>
    </group>
  );
}
