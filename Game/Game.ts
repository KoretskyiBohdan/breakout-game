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

export const createArray = (size = 0) => {
  const arr: null[] = [];

  for (let i = 0; i < size; i++) arr[i] = null;
  return arr;
};

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

  startGame() {
    this.createObjects();
    this.startScreenUpdates();
    this.ball.start();
  }

  stopGame() {
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

    this.ball = new Ball(BALL_INITIAL_POSITION, this.onBallPositionUpdate);
    this.user = new User(USER_INITIAL_POSITION);
  }

  onBallPositionUpdate = () => {
    const { ball, user } = this;

    // Blocks collisions
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];

      if (ball.hasCollisionsWith(block)) {
        if (ball.hasSideCollisionWith(block)) {
          ball.changeDirection('x');
        } else {
          ball.changeDirection('y');
        }
        this.blocks.splice(i, 1);
      }
    }

    // Board collisions
    if (ball.position.y - ball.radius <= 0) {
      ball.changeDirection('y');
    } else if (
      ball.position.x - ball.radius <= 0 ||
      ball.position.x + ball.radius >= SCREEN_WIDTH
    ) {
      ball.changeDirection('x');
    } else if (ball.position.y + ball.radius >= SCREEN_HEIGHT) {
      this.stopGame();
    }

    // User collission
    if (ball.hasCollisionsWith(user)) {
      // always change to top by Y
      ball.changeDirection('y', -1);
    }
  };

  private startScreenUpdates() {
    const perform = () => {
      this.screen.draw([...this.blocks, this.ball, this.user]);
      this.animationFrameId = requestAnimationFrame(perform);
    };

    perform();
  }
}
