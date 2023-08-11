import { BaseShape } from './BaseShape';
import { BLOCK_WIDTH, BLOCK_HEIGHT, COLORS, SCREEN_WIDTH } from './constants';

const MOVE_STEP = 15;
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
      const v = Math.max(this.position.x - MOVE_STEP, 0);
      this.position.x = v;
    }
    if (key === RIGHT_KEY) {
      const v = Math.min(
        this.position.x + MOVE_STEP,
        SCREEN_WIDTH - this.width
      );
      this.position.x = v;
    }
  };
}
