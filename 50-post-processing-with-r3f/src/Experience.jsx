import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { EffectComposer, Vignette, Glitch, Noise, Bloom } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';

export default function Experience() {
  return (
    <>
      <color args={['#000']} attach='background' />

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
        <Bloom mipmapBlur intensity={0.1} luminanceThreshold={0} />
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
        {/* <meshStandardMaterial color='white' emissive='purple' emissiveIntensity={2} toneMapped={false} /> */}
        <meshBasicMaterial color={[1.5 * 10, 1 * 10, 4 * 10]} toneMapped={false} />
      </mesh>

      <mesh receiveShadow position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
}
