import { useMemo } from 'react';
import { BlockStart, BlockSpinner, BlockLimbo, BlockAxe, BlockEnd, Bounds } from './';
import { geometries, materials } from './utils';

const { box } = geometries;
const { floor1, floor2, obstacle, wall } = materials;

export default function Level({ blocksCount = 5, types = [BlockSpinner, BlockLimbo, BlockAxe] }) {
  // Generate a blocks array filled with random items from types
  const blocks = useMemo(() => new Array(blocksCount).fill().map(() => types[Math.floor(Math.random() * types.length)]), [blocksCount, types]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block key={`block-#${index}`} position={[0, 0, -index * 4 - 4]} />
      ))}
      <BlockEnd position={[0, 0, -blocksCount * 4 - 4]} />
      <Bounds length={blocksCount + 2} />
    </>
  );
}
