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
import { createArray } from './utils';

const LEFT_KEY = 'ArrowLeft';
const RIGHT_KEY = 'ArrowRight';
// TODO: update as real speed per second
const MOVE_STEP = 15;
const BALL_SPEED = 2;

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

    window.document.addEventListener('keydown', this.onKeydown);
  }

  start() {
    this.createObjects();
    this.startBall();
    this.startScreenUpdates();
  }

  stop() {
    window.cancelAnimationFrame(this.animationFrameId);
    window.clearInterval(this.ballIntervalId);
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

  private createObjects() {
    this.blocks = createArray(ROWS * BLOCK_PER_ROW).map((_, i) => {
      const index = i % BLOCK_PER_ROW;
      const row = Math.floor(i / BLOCK_PER_ROW);
      const x = BLOCK_PADDING + index * (BLOCK_WIDTH + BLOCK_PADDING);
      const y = BLOCK_PADDING + (BLOCK_HEIGHT + BLOCK_PADDING) * row;
      return new Block(x, y);
    });

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
    let directionX = -BALL_SPEED;
    let directionY = -BALL_SPEED;

    this.ballIntervalId = setInterval(() => {
      const { ball, user } = this;

      for (let i = 0; i < this.blocks.length; i++) {
        // remove on collisions
      }

      if (ball.position.y - ball.height <= 0) {
        directionY = BALL_SPEED;
      } else if (ball.position.x - ball.width <= 0) {
        directionX = BALL_SPEED;
      } else if (ball.position.x + ball.width >= SCREEN_WIDTH) {
        directionX = -BALL_SPEED;
      } else if (ball.position.y + ball.height >= SCREEN_HEIGHT) {
        // todo: game over
        directionY = -BALL_SPEED;
      }

      if (
        user.position.x <= ball.position.x &&
        user.position.x + user.width >= ball.position.x + ball.width &&
        user.position.y <= ball.position.y + ball.height
      ) {
        directionY = -BALL_SPEED;
      }
      const x = Math.max(ball.position.x + directionX, ball.width);
      const y = Math.max(ball.position.y + directionY, ball.height);

      ball.moveX(Math.min(x, SCREEN_WIDTH - ball.width));
      ball.moveY(Math.min(y, SCREEN_HEIGHT - ball.height));
    });
  }

  private startScreenUpdates() {
    const perform = () => {
      this.screen.draw([...this.blocks, this.ball, this.user]);
      this.animationFrameId = requestAnimationFrame(perform);
    };

    perform();
  }
}
