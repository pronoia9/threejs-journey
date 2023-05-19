import { OrbitControls } from '@react-three/drei';
import { Physics, Debug } from '@react-three/rapier';

import { Lights, Level, Player } from './components';

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <Physics>
        <Debug />
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  );
}
