import { useMemo } from 'react';

import { BlockStart, BlockSpinner, BlockLimbo, BlockAxe, BlockEnd, Bounds } from './';
import { geometries, materials } from './utils';

const { box } = geometries;
const { floor1, floor2, obstacle, wall } = materials;

export default function Level({ blocksCount = 5, types = [BlockSpinner, BlockLimbo, BlockAxe], seed }) {
  // Generate a blocks array filled with random items from types
  const blocks = useMemo(() => new Array(blocksCount).fill().map(() => types[Math.floor(Math.random() * types.length)]), [blocksCount, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} geometry={box} material={floor1} />
      {blocks.map((Block, index) => (
        <Block key={`block-#${index}`} position={[0, 0, -index * 4 - 4]} geometry={box} materials={{ floor: floor2, obstacle }} />
      ))}
      <BlockEnd position={[0, 0, -blocksCount * 4 - 4]} geometry={box} material={floor1} />
      <Bounds length={blocksCount + 2} material={wall} />
    </>
  );
}
