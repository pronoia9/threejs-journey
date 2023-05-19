import { Physics, Debug } from '@react-three/rapier';

import { Lights, Level, Player } from './components';

export default function Experience() {
  return (
    <>
      <Physics>
        <Debug />
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  );
}
