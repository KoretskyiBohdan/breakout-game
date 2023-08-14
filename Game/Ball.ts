import { BaseShape } from './BaseShape';
import {
  BALL_SIZE,
  BALL_SPEED,
  COLORS,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from './constants';

type UpdateFnType = () => unknown;

export class Ball extends BaseShape {
  private animationFrameId: number;
  private onUpdate: UpdateFnType;

  directionX = -1;
  directionY = -1;

  constructor(x: number, y: number, onUpdate: UpdateFnType) {
    super({
      x,
      y,
      width: BALL_SIZE,
      height: BALL_SIZE,
      color: COLORS.BALL,
    });

    if (Math.round(Math.random())) this.changeDirection('x');

    this.onUpdate = onUpdate;
  }

  get radius() {
    return this.height / 2;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  start = () => {
    this.stop();

    let lastCall = Date.now();

    const move = () => {
      const now = Date.now();
      const secondsPassed = (now - lastCall) / 1000;
      const diff = BALL_SPEED * secondsPassed;
      const { radius, directionX, directionY } = this;

      const x = Math.max(this.x + diff * directionX, radius);
      const y = Math.max(this.y + diff * directionY, radius);

      this.x = Math.min(x, SCREEN_WIDTH - radius);
      this.y = Math.min(y, SCREEN_HEIGHT - radius);

      this.animationFrameId = requestAnimationFrame(move);
      lastCall = now;
      if (typeof this.onUpdate === 'function') this.onUpdate();
    };

    this.animationFrameId = requestAnimationFrame(move);
  };

  stop = () => {
    window.cancelAnimationFrame(this.animationFrameId);
  };

  hasCollisionsWith = (block: BaseShape): 'x' | 'y' | void => {
    let testX = this.x;
    let testY = this.y;

    if (this.x < block.x) {
      testX = block.x;
    } else if (this.x > block.x + block.width) {
      testX = block.x + block.width;
    }

    if (this.y < block.y) {
      testY = block.y;
    } else if (this.y > block.y + block.height) {
      testY = block.y + block.height;
    }

    const distX = this.x - testX;
    const distY = this.y - testY;

    const distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

    if (distance <= this.radius) {
      if (
        this.y + this.radius / 2 >= block.y &&
        this.y - this.radius / 2 <= block.y + block.height
      ) {
        return 'x';
      } else {
        return 'y';
      }
    }
  };

  changeDirection = (axis: 'x' | 'y', direction?: -1 | 1) => {
    const key = `direction${axis.toUpperCase()}`;
    this[key] = direction || -this[key];
  };
}
