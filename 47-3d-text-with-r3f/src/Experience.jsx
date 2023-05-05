import { OrbitControls, Text3D, Center, useMatcapTexture } from '@react-three/drei';
import { Perf } from 'r3f-perf';

export default function Experience() {
  const [textMatcap] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);

  return (
    <>
      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <Center>
        <Text3D
          font='./fonts/helvetiker_regular.typeface.json'
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelSegments={5}
        >
          Hello R3F
          <meshMatcapMaterial matcap={textMatcap} />
        </Text3D>
      </Center>
    </>
  );
}
