import { forwardRef } from 'react';

import DrunkEffect from './DrunkEffect.js';

export default forwardRef(function Drunk(props, ref) {
  const effect = new DrunkEffect(props);

  return <primitive ref={ref} object={effect} />;
});
