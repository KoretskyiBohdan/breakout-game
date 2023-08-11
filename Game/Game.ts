import { Screen } from './Screen';
import { Block } from './Block';
import { Movable } from './Movable';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  BLOCK_PADDING,
  ROWS,
  BLOCK_PER_ROW,
  BALL_DIAMETER,
  BALL_INITIAL_POSITION,
  USER_INITIAL_POSITION,
  COLORS,
} from './constants';

const LEFT_KEY = 'ArrowLeft';
const RIGHT_KEY = 'ArrowRight';
const MOVE_STEP = 15;

export class Game<R extends HTMLElement> {
  private screen: Screen<R>;
  private blocks: Block[] = [];
  private ball: Movable;
  private user: Movable;
  private animationFrameId: number;

  constructor(root: R) {
    this.screen = new Screen(root, {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
  }

  start() {
    this.generateBlocks();
    this.generateMovable();
    this.addDomEvents();
    this.startScreenUpdates();
  }

  stop() {
    window.cancelAnimationFrame(this.animationFrameId);
    this.removeDomEvents();
  }

  onKeydown = ({ key }: KeyboardEvent) => {
    const { user } = this;
    if (key === LEFT_KEY) user.moveX(-MOVE_STEP);
    if (key === RIGHT_KEY) user.moveX(MOVE_STEP);
  };

  private generateBlocks() {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < BLOCK_PER_ROW; j++) {
        const x = BLOCK_PADDING + j * (BLOCK_WIDTH + BLOCK_PADDING);
        const y = BLOCK_PADDING + (BLOCK_HEIGHT + BLOCK_PADDING) * i;
        this.blocks.push(new Block(x, y));
      }
    }
  }
  private generateMovable() {
    this.ball = new Movable(BALL_INITIAL_POSITION, {
      width: BALL_DIAMETER,
      height: BALL_DIAMETER,
      color: COLORS.BALL,
      type: 'ball',
    });

    this.user = new Movable(USER_INITIAL_POSITION, {
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT / 2,
      color: COLORS.USER,
      type: 'rect',
    });
  }

  private addDomEvents() {
    document.addEventListener('keydown', this.onKeydown);
  }

  private removeDomEvents() {
    document.removeEventListener('keydown', this.onKeydown);
  }

  private startScreenUpdates() {
    const perform = () => {
      this.screen.draw([...this.blocks, this.ball, this.user]);
      this.animationFrameId = requestAnimationFrame(perform);
    };

    perform();
  }
}
