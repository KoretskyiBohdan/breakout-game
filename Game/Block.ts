import { Shape } from './Shape';
import { BLOCK_WIDTH, BLOCK_HEIGHT, COLORS } from './constants';

export class Block extends Shape {
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
