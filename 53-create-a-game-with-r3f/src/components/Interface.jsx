import { useKeyboardControls } from '@react-three/drei';

import useGame from '../stores/useGame';

export default function Interface() {
  // Keys
  const forward = useKeyboardControls((state) => state.forward),
    rightward = useKeyboardControls((state) => state.rightward),
    backward = useKeyboardControls((state) => state.backward),
    leftward = useKeyboardControls((state) => state.leftward),
    space = useKeyboardControls((state) => state.space);
  // Store
  const phase = useGame((state) => state.phase),
    restart = useGame((state) => state.restart);

  return (
    <div className='interface'>
      {/* Time */}
      <div className='time'>0.00</div>
      {/* Restart */}
      {phase === 'ended' && <div className='restart' onClick={restart}>Restart</div>}
      {/* Controls */}
      <div className='controls'>
        <div className='raw'>
          <div className={`key ${forward ? 'active' : ''}`}>W</div>
        </div>
        <div className='raw'>
          <div className={`key ${leftward ? 'active' : ''}`}>A</div>
          <div className={`key ${backward ? 'active' : ''}`}>S</div>
          <div className={`key ${rightward ? 'active' : ''}`}>D</div>
        </div>
        <div className='raw'>
          <div className={`key ${space ? 'active' : ''} large`}>SPACE</div>
        </div>
      </div>
    </div>
  );
}
