import { Physics, Debug } from '@react-three/rapier';

import { Lights, Level, Player, Effects } from './components';
import useGame from './stores/useGame';

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      <color args={['#202734']} attach='background' />
      <Physics>
        <Debug />
        <Level blocksCount={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
      <Lights />
      <Effects />
    </>
  );
}
