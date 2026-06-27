import { BaseShape } from './BaseShape';
import { BLOCK_WIDTH, BLOCK_HEIGHT, COLORS } from './constants';

export class Block extends BaseShape {
  isDestroyed = false;
  opacity = 1;
  intervalId?: number;

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
    ctx.globalAlpha = this.opacity;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  };

  reset = () => {
    if (this.intervalId) {
      window.cancelAnimationFrame(this.intervalId);
    }
    this.isDestroyed = false;
    this.opacity = 1;
  };

  destroy = () => {
    this.isDestroyed = true;

    const fade = () => {
      if (this.opacity <= 0) return;
      this.opacity = Math.max(this.opacity - 0.11, 0);
      this.intervalId = window.requestAnimationFrame(fade);
    };

    this.intervalId = window.requestAnimationFrame(fade);
  };
}
