import { BaseShape } from './BaseShape';
import { BLOCK_WIDTH, BLOCK_HEIGHT, COLORS } from './constants';

export class Block extends BaseShape {
  isDistroyed = false;
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

  destroy = () => {
    this.isDistroyed = true;

    const interval = window.setInterval(() => {
      if (this.opticity === 0) {
        window.clearInterval(interval);
        return;
      }

      this.opticity = Math.max(this.opticity - 0.065, 0);
    }, 16);
  };
}
