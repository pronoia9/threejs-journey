import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { EffectComposer, Vignette, Glitch, Noise, Bloom, DepthOfField, SSR } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { useControls } from 'leva';

import Drunk from './Drunk';

export default function Experience() {
  const drunkRef = useRef();
  // const ssrProps = useControls('SSR Effect', {
  //   temporalResolve: true,
  //   STRETCH_MISSED_RAYS: true,
  //   USE_MRT: true,
  //   USE_NORMALMAP: true,
  //   USE_ROUGHNESSMAP: true,
  //   ENABLE_JITTERING: true,
  //   ENABLE_BLUR: true,
  //   temporalResolveMix: { value: 0.9, min: 0, max: 1 },
  //   temporalResolveCorrectionMix: { value: 0.25, min: 0, max: 1 },
  //   maxSamples: { value: 0, min: 0, max: 1 },
  //   resolutionScale: { value: 1, min: 0, max: 1 },
  //   blurMix: { value: 0.5, min: 0, max: 1 },
  //   blurKernelSize: { value: 8, min: 0, max: 8 },
  //   blurSharpness: { value: 0.5, min: 0, max: 1 },
  //   rayStep: { value: 0.3, min: 0, max: 1 },
  //   intensity: { value: 1, min: 0, max: 5 },
  //   maxRoughness: { value: 0.1, min: 0, max: 1 },
  //   jitter: { value: 0.7, min: 0, max: 5 },
  //   jitterSpread: { value: 0.45, min: 0, max: 1 },
  //   jitterRough: { value: 0.1, min: 0, max: 1 },
  //   roughnessFadeOut: { value: 1, min: 0, max: 1 },
  //   rayFadeOut: { value: 0, min: 0, max: 1 },
  //   MAX_STEPS: { value: 20, min: 0, max: 20 },
  //   NUM_BINARY_SEARCH_STEPS: { value: 5, min: 0, max: 10 },
  //   maxDepthDifference: { value: 3, min: 0, max: 10 },
  //   maxDepth: { value: 1, min: 0, max: 1 },
  //   thickness: { value: 10, min: 0, max: 10 },
  //   ior: { value: 1.45, min: 0, max: 2 },
  // });

  return (
    <>
      <color args={['#fff']} attach='background' />

      <EffectComposer>
        {/* <Vignette offset={0.3} darkness={0.9} eskil={true} blendFunction={BlendFunction.NORMAL} /> */}
        {/* <Glitch
          delay={[0.5, 1]} // min and max glitch delay
          duration={[0.1, 0.3]} // min and max glitch duration
          strength={[0.2, 0.4]} // min and max glitch strength
          mode={GlitchMode.CONSTANT_MILD} // glitch mode
          active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
          ratio={0.85} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
        /> */}
        {/* <Noise premultiply // enables or disables noise premultiplication blendFunction={BlendFunction.OVERLAY} /> */}
        {/* <Bloom mipmapBlur intensity={0.1} luminanceThreshold={0} /> */}
        {/* <DepthOfField
          focusDistance={0.025} // where to focus
          focalLength={0.025} // focal length
          bokehScale={6} // bokeh size
        /> */}
        {/* <SSR {...ssrProps} /> */}
        <Drunk ref={drunkRef} frequency={2} amplitude={0.1} />
      </EffectComposer>

      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color='orange' />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color='mediumpurple' />
        {/* <meshStandardMaterial color='white' emissive='purple' emissiveIntensity={2} toneMapped={false} /> */}
        {/* <meshBasicMaterial color={[1.5 * 10, 1 * 10, 4 * 10]} toneMapped={false} /> */}
      </mesh>

      <mesh receiveShadow position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
        {/* <meshStandardMaterial color='black' roughness={0} metalness={0} /> */}
      </mesh>
    </>
  );
}
