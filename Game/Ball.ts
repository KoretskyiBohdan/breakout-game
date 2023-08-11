import { BaseShape } from './BaseShape';
import { BALL_SIZE, COLORS, SCREEN_WIDTH, SCREEN_HEIGHT } from './constants';

const BALL_SPEED = 100;

export class Ball extends BaseShape {
  private animationFrameId: number;

  directionX = 1;
  directionY = 1;

  constructor(position: { x: number; y: number }) {
    super(position, {
      width: BALL_SIZE,
      height: BALL_SIZE,
      color: COLORS.BALL,
      type: 'ball',
    });
  }

  start = () => {
    window.cancelAnimationFrame(this.animationFrameId);

    let lastCall = Date.now();

    const move = () => {
      const now = Date.now();
      const secondsPassed = (now - lastCall) / 1000;
      const diff = BALL_SPEED * secondsPassed;
      const { position, height, directionX, directionY } = this;
      const radius = height / 2;

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
  // placeholder
  onUpdate: () => unknown;

  changeDirection(axis: 'x' | 'y', direction?: -1 | 1) {
    if (axis === 'x') this.directionX = direction || -this.directionX;
    if (axis === 'y') this.directionY = direction || -this.directionY;
  }

  changeDirectionX = (v?: number) => (this.directionX = v || -this.directionX);
  changeDirectionY = (v?: number) => (this.directionY = v || -this.directionY);
}
