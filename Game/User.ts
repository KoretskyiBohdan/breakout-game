import { BaseShape } from './BaseShape';
import {
  USER_MOVE_STEP,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  COLORS,
  SCREEN_WIDTH,
} from './constants';

const LEFT_KEY = 'ArrowLeft';
const RIGHT_KEY = 'ArrowRight';

export class User extends BaseShape {
  constructor(position: { x: number; y: number }) {
    super(position, {
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT / 2,
      color: COLORS.USER,
      type: 'rect',
    });

    window.document.addEventListener('keydown', this.onKeydown);
  }

  onKeydown = ({ key }) => {
    if (key === LEFT_KEY) {
      const v = Math.max(this.position.x - USER_MOVE_STEP, 0);
      this.position.x = v;
    }
    if (key === RIGHT_KEY) {
      const v = Math.min(
        this.position.x + USER_MOVE_STEP,
        SCREEN_WIDTH - this.width
      );
      this.position.x = v;
    }
  };
}
