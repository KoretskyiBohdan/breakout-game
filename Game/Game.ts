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
  private ballIntervalId: number;

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
    this.startBall();
    this.startScreenUpdates();
  }

  stop() {
    window.cancelAnimationFrame(this.animationFrameId);
    window.clearInterval(this.ballIntervalId);
    this.removeDomEvents();
  }

  onKeydown = ({ key }: KeyboardEvent) => {
    const { user } = this;
    if (key === LEFT_KEY) {
      const v = Math.max(user.position.x - MOVE_STEP, 0);
      user.moveX(v);
    }
    if (key === RIGHT_KEY) {
      const v = Math.min(
        user.position.x + MOVE_STEP,
        SCREEN_WIDTH - user.width
      );
      user.moveX(v);
    }
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
      width: BALL_DIAMETER / 2,
      height: BALL_DIAMETER / 2,
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

  private startBall() {
    const { ball } = this;
    const { user } = this;

    let directionX = 2;
    let directionY = 2;

    this.ballIntervalId = setInterval(() => {
      const { position } = ball;

      if (position.y - ball.height <= 0) {
        directionY = 2;
      }
      if (position.x - ball.width <= 0) {
        directionX = 2;
      }
      if (position.x + ball.width >= SCREEN_WIDTH) {
        directionX = -2;
      }

      if (position.y + ball.height >= SCREEN_HEIGHT) {
        // GAME OVER!
        this.stop();
      }

      if (ball.isCollision(user)) {
        directionY = -2;
      }
      ball.moveX(position.x + directionX);
      ball.moveY(position.y + directionY);
    }, 50);
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
