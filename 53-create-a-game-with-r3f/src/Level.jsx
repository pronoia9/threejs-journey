import { BoxGeometry } from 'three';

const boxGeometry = new BoxGeometry(1, 1, 1);

export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 0]} />
    </>
  );
}

function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh geometry={boxGeometry} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow>
        <meshStandardMaterial color='limegreen' />
      </mesh>
    </group>
  );
}
