import { /* useState, */ useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls, Text3D, Center, useMatcapTexture } from '@react-three/drei';
import { Perf } from 'r3f-perf';

export default function Experience() {
  const [[textMatcap], [donutMatcap]] = [
    useMatcapTexture('CB4E88_F99AD6_F384C3_ED75B9', 256),
    useMatcapTexture('7877EE_D87FC5_75D9C7_1C78C0', 256),
  ];

  // const [donutGeometry, setDonutGeometry] = useState(), [donutMaterial, setDonutMaterial] = useState();
  const donutGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32),
    donutMaterial = new THREE.MeshMatcapMaterial();

  // Update donut materials
  useEffect(() => {
    donutMatcap.encoding = THREE.sRGBEncoding;
    donutMatcap.needsUpdate = true;
    donutMaterial.matcap = donutMatcap;
    donutMaterial.needsUpdate = true;
  }, []);

  return (
    <>
      <Perf position='top-left' />

      <OrbitControls makeDefault />

      {/* <torusGeometry ref={setDonutGeometry} args={[1, 0.6, 16, 32]} /> */}
      {/* <meshMatcapMaterial ref={setDonutMaterial} matcap={donutMatcap} /> */}

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

      {[...Array(100)].map((v, i) => {
        const position = () => (Math.random() - 0.5) * 10;
        const scale = () => 0.2 + Math.random() * 0.2;
        const rotation = () => Math.random() * Math.PI;

        return (
          <mesh
            key={`donut-#${i}`}
            geometry={donutGeometry}
            material={donutMaterial}
            position={[position(), position(), position()]}
            scale={scale()}
            rotation={[rotation(), rotation(), 0]}
          />
        );
      })}
    </>
  );
}
