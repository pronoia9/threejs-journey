import { useRef, useState } from 'react';
import { BoxGeometry, ColorManagement, Euler, MeshStandardMaterial, Quaternion } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

import BlockStart from './BlockStart';

// Fix Colors
ColorManagement.legacyMode = false;
// Materials
const boxGeometry = new BoxGeometry(1, 1, 1);
const floor1Material = new MeshStandardMaterial({ color: 'limegreen' });
const floor2Material = new MeshStandardMaterial({ color: 'greenyellow' });
const obstacleMaterial = new MeshStandardMaterial({ color: 'orangered' });
const wallMaterial = new MeshStandardMaterial({ color: 'slategrey' });

export default function Level({ count = 5, types = [] }) {
  return (
    <>
      <BlockStart position={[0, 0, 0]} geometry={boxGeometry} materials={{ floor: floor1Material }} />
    </>
  );
}
