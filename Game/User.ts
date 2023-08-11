import { BaseShape } from './BaseShape';
import {
  USER_SPEED,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  COLORS,
  SCREEN_WIDTH,
} from './constants';

const LEFT_KEY = 'ArrowLeft';
const RIGHT_KEY = 'ArrowRight';
const ANIMATION_DURATION = 0.1;

export class User extends BaseShape {
  private animationFrameId: number;

  constructor(position: { x: number; y: number }) {
    super(position, {
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT / 2,
      color: COLORS.USER,
      type: 'rect',
    });

    window.document.addEventListener('keydown', this.onKeydown);
  }

  move = (direction: 1 | -1) => {
    window.cancelAnimationFrame(this.animationFrameId);

    const startPosition = this.position.x;
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

      this.position.x = Math.max(Math.min(x, SCREEN_WIDTH - this.width), 0);

      if (!isDone) {
        this.animationFrameId = window.requestAnimationFrame(performAnimation);
      }
    };

    this.animationFrameId = window.requestAnimationFrame(performAnimation);
  };

  onKeydown = ({ key }) => {
    if (key === LEFT_KEY) this.move(-1);
    if (key === RIGHT_KEY) this.move(1);
  };

  clear() {
    window.document.removeEventListener('keydown', this.onKeydown);
  }
}
