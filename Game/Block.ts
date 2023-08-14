import { BaseShape } from './BaseShape';
import { BLOCK_WIDTH, BLOCK_HEIGHT, COLORS } from './constants';

export class Block extends BaseShape {
  isDistroyed = false;
  opticity = 1;
  intervalId: number;

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

  reset = () => {
    window.clearInterval(this.intervalId);
    this.isDistroyed = false;
    this.opticity = 1;
  };

  destroy = () => {
    this.isDistroyed = true;

    this.intervalId = window.setInterval(() => {
      if (this.opticity === 0) {
        window.clearInterval(this.intervalId);
        return;
      }

      this.opticity = Math.max(this.opticity - 0.11, 0);
    }, 16);
  };
}
