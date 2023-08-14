import { Screen } from './Screen';
import { Controls } from './Controls';
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
  BLOCKS_PER_ROW,
} from './constants';

export const createArray = (size = 0) => {
  const arr: null[] = [];

  for (let i = 0; i < size; i++) arr[i] = null;
  return arr;
};

export class Game<R extends HTMLElement> {
  private root: R;
  private screen: Screen<R>;
  private controls: Controls;
  private blocks: Block[] = [];
  private ball: Ball;
  private user: User;
  private score: number = 0;
  private level = 1;

  constructor(root: R) {
    this.root = root;
    this.screen = new Screen(root, {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      onUpdate: () => {
        this.screen.draw([...this.blocks, this.ball, this.user]);
      },
    });

    this.controls = new Controls(root, {
      START: () => this.startGame(),
      NEW: () => this.startGame(),
    });

    this.createObjects();
    this.screen.enableRefresh();
  }

  startGame = () => {
    this.stopGame();
    this.updateScore(0);
    this.createObjects();

    this.ball.start();
    this.user.start();
    this.controls.setIsRuning(true);
  };

  stopGame = () => {
    this.ball.stop();
    this.controls.setIsRuning(false);
  };

  private updateScore = (val: number) => {
    this.score = val;
    const score = this.root.getElementsByClassName('score')[0];
    if (score) score.innerHTML = `Score: ${this.score}`;
  };

  private createObjects() {
    this.blocks = createArray(ROWS * BLOCKS_PER_ROW).map((_, i) => {
      const index = i % BLOCKS_PER_ROW;
      const row = Math.floor(i / BLOCKS_PER_ROW);
      const x = BLOCK_PADDING + index * (BLOCK_WIDTH + BLOCK_PADDING);
      const y = BLOCK_PADDING + (BLOCK_HEIGHT + BLOCK_PADDING) * row;
      return new Block(x, y);
    });

    this.ball = new Ball(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - 40,
      this.onBallPositionUpdate
    );
    this.user = new User(
      SCREEN_WIDTH / 2 - BLOCK_WIDTH / 2,
      SCREEN_HEIGHT - BLOCK_HEIGHT / 2 - BLOCK_PADDING
    );
  }

  private onBallPositionUpdate = () => {
    const nonDestroyedBlocks = this.blocks.filter((b) => !b.isDistroyed);

    if (nonDestroyedBlocks.length === 0) return this.stopGame();

    const { ball, user } = this;

    // Blocks collisions
    nonDestroyedBlocks.forEach((block) => {
      const axis = this.ball.hasCollisionsWith(block);

      if (axis) {
        block.destroy();
        ball.changeDirection(axis);
        this.updateScore(this.score + 10 * this.level);
      }
    });

    // Board collisions
    if (ball.y - ball.radius <= 0) {
      ball.changeDirection('y');
    } else if (
      ball.x - ball.radius <= 0 ||
      ball.x + ball.radius >= SCREEN_WIDTH
    ) {
      ball.changeDirection('x');
    } else if (ball.y + ball.radius >= SCREEN_HEIGHT) {
      this.stopGame();
    }

    const axis = this.ball.hasCollisionsWith(user);

    // User collission
    if (axis) {
      // always change to top by Y
      ball.changeDirection('y', -1);
    }
  };
}
