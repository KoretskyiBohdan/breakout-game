import { BaseShape } from './BaseShape';
import { BLOCK_WIDTH, BLOCK_HEIGHT, COLORS } from './constants';

export class Block extends BaseShape {
  isDistroyed = false;
  opticity = 1;

  constructor(x: number, y: number) {
    super({
      x,
      y,
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
      color: COLORS.BLOCK,
    });
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opticity;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  };

  destroy = () => {
    this.isDistroyed = true;

    const interval = window.setInterval(() => {
      if (this.opticity === 0) {
        window.clearInterval(interval);
        return;
      }

      this.opticity = Math.max(this.opticity - 0.09, 0);
    }, 16);
  };
}
