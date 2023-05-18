import { useMemo } from 'react';
import { BlockStart, BlockSpinner, BlockLimbo, BlockAxe, BlockEnd } from './';
import { geometries, materials } from './utils';

const { box } = geometries;
const { floor1, floor2, obstacle, wall } = materials;

export default function Level({ count = 5, types = [BlockSpinner, BlockLimbo, BlockAxe] }) {
  // Generate a blocks array filled with random items from types
  const blocks = useMemo(() => new Array(count).fill().map(() => types[Math.floor(Math.random() * types.length)]), [count, types]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block key={`block-#${index}`} position={[0, 0, -index * 4 - 4]} />
      ))}
    </>
  );
}
