import { BaseShape } from './BaseShape';
import {
  USER_SPEED,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  COLORS,
  SCREEN_WIDTH,
} from './constants';

const ANIMATION_DURATION = 0.13;

export class User extends BaseShape {
  private animationFrameId: number;
  private _initialX: number;

  constructor(x: number, y: number) {
    super({
      x,
      y,
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT / 2,
      color: COLORS.USER,
    });

    this._initialX = x;
  }

  reset = () => {
    this.x = this._initialX;
  };

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  move = (direction: 1 | -1) => {
    window.cancelAnimationFrame(this.animationFrameId);

    const startPosition = this.x;
    const startTimeStamp = Date.now();
    let isDone = false;

    const performAnimation = () => {
      const passed = (Date.now() - startTimeStamp) / 1000;
      let t = passed / ANIMATION_DURATION;

      if (t >= 1) {
        t = 1;
        isDone = true;
      }

      const updated = USER_SPEED * ANIMATION_DURATION * t;

      const x = startPosition + (direction < 0 ? -updated : updated);

      this.x = Math.max(Math.min(x, SCREEN_WIDTH - this.width), 0);

      if (!isDone) {
        this.animationFrameId = window.requestAnimationFrame(performAnimation);
      }
    };

    this.animationFrameId = window.requestAnimationFrame(performAnimation);
  };
}
