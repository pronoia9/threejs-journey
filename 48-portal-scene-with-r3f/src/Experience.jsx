import { OrbitControls, useGLTF, useTexture, Center, Sparkles } from '@react-three/drei';
import { Color } from 'three';

import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';

export default function Experience() {
  const { nodes } = useGLTF('./model/portal.glb'),
    bakedTexture = useTexture('/model/baked.jpg');

  return (
    <>
      <color args={['#030202']} attach='background' />

      <OrbitControls makeDefault />

      <Center>
        {/* Scene */}
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} map-flipY={false} />
        </mesh>
        {/* Pole Lights */}
        <mesh geometry={nodes.poleLightA.geometry} position={nodes.poleLightA.position}>
          <meshBasicMaterial color='#ffffe5' />
        </mesh>
        <mesh geometry={nodes.poleLightB.geometry} position={nodes.poleLightB.position}>
          <meshBasicMaterial color='#ffffe5' />
        </mesh>
        {/* Portal */}
        <mesh
          geometry={nodes.portalLight.geometry}
          position={nodes.portalLight.position}
          rotation={nodes.portalLight.rotation}
        >
          <shaderMaterial
            vertexShader={portalVertexShader}
            fragmentShader={portalFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uColorStart: { value: new Color('#ffffff') },
              uColorEnd: { value: new Color('#000000') },
            }}
          />
        </mesh>
        {/* Fireflies */}
        <Sparkles size={6} scale={[4, 2, 4]} position={[0, 1, 0]} speed={0.2} count={40} />
      </Center>
    </>
  );
}
