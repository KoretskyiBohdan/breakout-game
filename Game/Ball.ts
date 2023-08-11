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

  constructor(position: { x: number; y: number }, onUpdate: UpdateFnType) {
    super(position, {
      width: BALL_SIZE,
      height: BALL_SIZE,
      color: COLORS.BALL,
      type: 'ball',
    });

    this.onUpdate = onUpdate;
  }

  get radius() {
    return this.height / 2;
  }

  start = () => {
    this.stop();

    let lastCall = Date.now();

    const move = () => {
      const now = Date.now();
      const secondsPassed = (now - lastCall) / 1000;
      const diff = BALL_SPEED * secondsPassed;
      const { position, radius, directionX, directionY } = this;

      const x = Math.max(position.x + diff * directionX, radius);
      const y = Math.max(position.y + diff * directionY, radius);

      position.x = Math.min(x, SCREEN_WIDTH - radius);
      position.y = Math.min(y, SCREEN_HEIGHT - radius);

      this.animationFrameId = requestAnimationFrame(move);
      lastCall = now;
      if (typeof this.onUpdate === 'function') this.onUpdate();
    };

    this.animationFrameId = requestAnimationFrame(move);
  };

  stop = () => {
    window.cancelAnimationFrame(this.animationFrameId);
  };

  hasCollisionsWith(obj: BaseShape) {
    return (
      this.position.x + this.radius >= obj.position.x &&
      this.position.x - this.radius <= obj.position.x + obj.width &&
      this.position.y + this.radius >= obj.position.y &&
      this.position.y - this.radius <= obj.position.y + obj.height
    );
  }

  hasSideCollisionWith(obj: BaseShape) {
    const offset = 2;
    const byLeft =
      this.position.x + this.radius >= obj.position.x &&
      this.position.x + this.radius <= obj.position.x + offset;
    const byRight =
      this.position.x - this.radius >= obj.position.x + obj.width - offset &&
      this.position.x - this.radius <= obj.position.x + obj.width;
    return byLeft || byRight;
  }

  changeDirection(axis: 'x' | 'y', direction?: -1 | 1) {
    const key = `direction${axis.toUpperCase()}`;
    this[key] = direction || -this[key];
  }
}
