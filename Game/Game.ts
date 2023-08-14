import { Events } from './Events';
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

export class Game<C extends HTMLCanvasElement> {
  private canvas: C;
  private events = new Events<'start' | 'won' | 'lose' | 'score:update'>();
  private blocks: Block[] = [];
  private ball: Ball;
  private user: User;
  private isRunning = false;
  public score: number = 0;
  public level = 1;

  constructor(canvas: C) {
    this.canvas = canvas;
    this.canvas.width = SCREEN_WIDTH;
    this.canvas.height = SCREEN_HEIGHT;

    window.document.addEventListener('keydown', this.onKeydown);

    this.addGameListeners();
    this.addGameObjects();
    this.startUpdates();
  }

  start = () => this.events.emit('start');

  on = this.events.on;

  private addGameListeners = () => {
    this.events
      .on('start', () => {
        this.isRunning = true;
        this.updateScore(0);
        this.resetObjects();
        if (Math.round(Math.random())) this.ball.changeDirection('x');
      })
      .on('won', () => {
        this.isRunning = false;
      })
      .on('lose', () => {
        this.isRunning = false;
      });
  };

  private addGameObjects = () => {
    for (let i = 0; i < ROWS * BLOCKS_PER_ROW; i++) {
      const index = i % BLOCKS_PER_ROW;
      const row = Math.floor(i / BLOCKS_PER_ROW);
      const x = BLOCK_PADDING + index * (BLOCK_WIDTH + BLOCK_PADDING);
      const y = BLOCK_PADDING + (BLOCK_HEIGHT + BLOCK_PADDING) * row;
      this.blocks.push(new Block(x, y));
    }

    this.ball = new Ball(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 40);
    this.user = new User(
      SCREEN_WIDTH / 2 - BLOCK_WIDTH / 2,
      SCREEN_HEIGHT - BLOCK_HEIGHT / 2 - BLOCK_PADDING
    );
  };

  private resetObjects = () => {
    this.blocks.forEach((block) => block.reset());
    this.ball.reset();
    this.user.reset();
  };

  private startUpdates = () => {
    let lastUpdate = Date.now();
    let firstPaint = true;
    const performScreenUpdate = () => {
      if (this.isRunning || firstPaint) {
        const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.moveBall(lastUpdate);
        this.checkBallCollissions();

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.blocks.forEach((block) => block.draw(ctx));
        this.ball.draw(ctx);
        this.user.draw(ctx);
      }

      lastUpdate = Date.now();
      firstPaint = false;

      requestAnimationFrame(performScreenUpdate);
    };

    performScreenUpdate();
  };

  moveBall = (lastUpdate: number) => {
    const { radius, directionX, directionY } = this.ball;

    const now = Date.now();
    const secondsPassed = (now - lastUpdate) / 1000;
    const diff = this.ball.speed * secondsPassed;

    const x = Math.max(this.ball.x + diff * directionX, radius);
    const y = Math.max(this.ball.y + diff * directionY, radius);

    this.ball.x = Math.min(x, SCREEN_WIDTH - radius);
    this.ball.y = Math.min(y, SCREEN_HEIGHT - radius);
  };

  private onKeydown = ({ key }: KeyboardEvent) => {
    if (!this.isRunning) return;
    if (key === 'ArrowLeft') this.user.move(-1);
    if (key === 'ArrowRight') this.user.move(1);
  };

  private updateScore = (val: number) => {
    this.score = val;
    this.events.emit('score:update');
  };

  private checkBallCollissions = () => {
    const nonDestroyedBlocks = this.blocks.filter((b) => !b.isDistroyed);

    if (nonDestroyedBlocks.length === 0) return this.events.emit('won');

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
      this.events.emit('lose');
    }

    // User collission
    if (this.ball.hasCollisionsWith(user)) {
      // always change to top by Y
      ball.changeDirection('y', -1);
    }
  };
}
