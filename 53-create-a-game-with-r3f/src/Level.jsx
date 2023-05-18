import { useRef, useState } from 'react';
import { BoxGeometry, ColorManagement, Euler, MeshStandardMaterial, Quaternion } from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

// Fix Colors
ColorManagement.legacyMode = false;
// Materials
const boxGeometry = new BoxGeometry(1, 1, 1);
const floor1Material = new MeshStandardMaterial({ color: 'limegreen' });
const floor2Material = new MeshStandardMaterial({ color: 'greenyellow' });
const obstacleMaterial = new MeshStandardMaterial({ color: 'orangered' });
const wallMaterial = new MeshStandardMaterial({ color: 'slategrey' });

export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 4]} />
      <BlockSpinner position={[0, 0, 0]} />
    </>
  );
}

function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={boxGeometry} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} material={floor1Material} receiveShadow />
    </group>
  );
}

function BlockSpinner({ position = [0, 0, 0] }) {
  const [speed] = useState(Math.random() + 0.2);
  const obstacleRef = useRef();

  // Animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Rotation of the obstacle
    const rotation = new Quaternion();
    rotation.setFromEuler(new Euler(0, time * speed, 0));
    obstacleRef.current.setNextKinematicRotation(rotation);
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
