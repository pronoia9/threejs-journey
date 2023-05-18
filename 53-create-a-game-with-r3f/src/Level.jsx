import { BoxGeometry, MeshStandardMaterial } from 'three';

const boxGeometry = new BoxGeometry(1, 1, 1);
const floor1Material = new MeshStandardMaterial({ color: 'limegreen' });
const floor2Material = new MeshStandardMaterial({ color: 'greenyellow' });
const obstacleMaterial = new MeshStandardMaterial({ color: 'orangered' });
const wallMaterial = new MeshStandardMaterial({ color: 'slategrey' });

export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 0]} scale={[4, 0.2, 4]} material={floor1Material} />
    </>
  );
}

function BlockStart({ position = [0, 0, 0], scale, material }) {
  return (
    <group position={position}>
      <mesh geometry={boxGeometry} position={[0, -0.1, 0]} scale={scale} material={material} receiveShadow />
    </group>
  );
}
