import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export default function Model() {
  const hamburger = useLoader(GLTFLoader, './hamburger-draco.glb', (loader) => {
    loader.setDRACOLoader(new DRACOLoader().setDecoderPath('./draco/'));
  });

  return <primitive object={hamburger.scene} scale={0.35} />;
}
