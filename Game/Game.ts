import { Screen } from './Screen';
import { Block } from './Block';
import { Ball } from './Ball';
import { User } from './User';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  BLOCK_PADDING,
  ROWS,
  BLOCK_PER_ROW,
  BALL_INITIAL_POSITION,
  USER_INITIAL_POSITION,
} from './constants';
import { createArray } from './utils';

export class Game<R extends HTMLElement> {
  private screen: Screen<R>;
  private blocks: Block[] = [];
  private ball: Ball;
  private user: User;
  private animationFrameId: number;

  constructor(root: R) {
    this.screen = new Screen(root, {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
  }

  start() {
    this.createObjects();
    this.startBall();
    this.startScreenUpdates();
  }

  stop() {
    window.cancelAnimationFrame(this.animationFrameId);
    this.ball.stop();
  }

  private createObjects() {
    this.blocks = createArray(ROWS * BLOCK_PER_ROW).map((_, i) => {
      const index = i % BLOCK_PER_ROW;
      const row = Math.floor(i / BLOCK_PER_ROW);
      const x = BLOCK_PADDING + index * (BLOCK_WIDTH + BLOCK_PADDING);
      const y = BLOCK_PADDING + (BLOCK_HEIGHT + BLOCK_PADDING) * row;
      return new Block(x, y);
    });

    this.ball = new Ball(BALL_INITIAL_POSITION);
    this.user = new User(USER_INITIAL_POSITION);
  }

  private startBall() {
    const { ball, user } = this;
    ball.start();

    ball.onUpdate = () => {
      const radius = ball.height / 2;

      if (ball.position.y - radius <= 0) {
        ball.changeDirection('y');
      } else if (
        ball.position.x - radius <= 0 ||
        ball.position.x + radius >= SCREEN_WIDTH
      ) {
        ball.changeDirection('x');
      } else if (ball.position.y + radius >= SCREEN_HEIGHT) {
        this.stop();
      }

      if (
        ball.position.x - radius >= user.position.x &&
        ball.position.x - radius <= user.position.x + user.width &&
        ball.position.y + radius >= user.position.y &&
        ball.position.y - radius <= user.position.y
      ) {
        // always change to top by Y
        ball.changeDirection('y', -1);
      }
    };
  }

  private startScreenUpdates() {
    const perform = () => {
      this.screen.draw([...this.blocks, this.ball, this.user]);
      this.animationFrameId = requestAnimationFrame(perform);
    };

    perform();
  }
}
