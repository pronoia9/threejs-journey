import { Physics, Debug } from '@react-three/rapier';

import { Lights, Level, Player } from './components';
import useGame from './stores/useGame';

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);

  return (
    <>
      <Physics>
        <Debug />
        <Lights />
        <Level blocksCount={blocksCount} />
        <Player />
      </Physics>
    </>
  );
}
