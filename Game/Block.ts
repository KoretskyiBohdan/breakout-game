import { BaseShape } from './BaseShape';
import { BLOCK_WIDTH, BLOCK_HEIGHT, COLORS } from './constants';

export class Block extends BaseShape {
  constructor(x: number, y: number) {
    super(
      { x, y },
      {
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        type: 'rect',
        color: COLORS.BLOCK,
      }
    );
  }
}
