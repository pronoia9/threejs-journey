import { Physics, Debug } from '@react-three/rapier';

import { Lights, Level, Player } from './components';
import useGame from './stores/useGame';

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      <Physics>
        <Debug />
        <Lights />
        <Level blocksCount={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
    </>
  );
}
