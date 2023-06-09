import { useRef } from 'react';
import {
  OrbitControls,
  TransformControls,
  PivotControls,
  Html,
  Text,
  Float,
  MeshReflectorMaterial,
} from '@react-three/drei';

export default function Experience() {
  const sphereRef = useRef(),
    cubeRef = useRef();

  return (
    <group>
      {/* Controls */}
      <OrbitControls makeDefault />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {/* Objects */}
      <group>
        <PivotControls anchor={[0, 0, 0]} depthTest={false} lineWidth={1} scale={100} fixed={true}>
          <mesh position-x={-2} ref={sphereRef}>
            <sphereGeometry />
            <meshStandardMaterial color='orange' />
            <Html
              wrapperClass='label'
              position={[1, 1, 0]}
              center
              distanceFactor={6}
              occlude={[sphereRef, cubeRef]}
            >
              That's a sphere 👍
            </Html>
          </mesh>
        </PivotControls>

        <mesh position-x={2} scale={1.5} ref={cubeRef}>
          <boxGeometry />
          <meshStandardMaterial color='mediumpurple' />
        </mesh>
        <TransformControls object={cubeRef} />

        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
          {/* <meshStandardMaterial color='greenyellow' /> */}
          <MeshReflectorMaterial
            color='greenyellow'
            resolution={512}
            blur={[1000, 1000]}
            mixBlur={1}
            mirror={0.75}
          />
        </mesh>

        <Float speed={2} floatIntensity={1}>
          <Text
            font='./bangers-v20-latin-regular.woff'
            fontSize={1}
            color='salmon'
            position={[0, 2, 0]}
            maxWidth={2} // line break
            textAlign='center'
          >
            I Love R3F
            {/* <meshNormalMaterial /> */}
          </Text>
        </Float>
      </group>
    </group>
  );
}
