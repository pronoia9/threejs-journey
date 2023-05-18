import { BlockStart, BlockSpinner, BlockLimbo, BlockAxe, BlockEnd } from './';
import { geometries, materials } from './utils';

const { box } = geometries;
const { floor1, floor2, obstacle, wall } = materials;

export default function Level({ count = 5, types = [BlockSpinner, BlockLimbo, BlockAxe] }) {
  return (
    <>
      <BlockStart position={[0, 0, 0]} geometry={box} materials={{ floor: floor1 }} />
    </>
  );
}
