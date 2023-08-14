import { BaseShape } from './BaseShape';
import { BALL_SIZE, BALL_SPEED, COLORS } from './constants';

export class Ball extends BaseShape {
  speed = BALL_SPEED;
  radius = BALL_SIZE / 2;
  directionX = -1;
  directionY = -1;

  private _initialParams: Record<string, number> = {};

  constructor(x: number, y: number) {
    super({
      x,
      y,
      width: BALL_SIZE,
      height: BALL_SIZE,
      color: COLORS.BALL,
    });

    this._initialParams = {
      x,
      y,
      directionX: this.directionX,
      directionY: this.directionY,
    };
  }

  reset = () => Object.assign(this, this._initialParams);

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };

  hasCollisionsWith = (block: BaseShape): 'x' | 'y' | void => {
    let testX = this.x;
    let testY = this.y;

    if (this.x < block.x) {
      testX = block.x;
    } else if (this.x > block.x + block.width) {
      testX = block.x + block.width;
    }

    if (this.y < block.y) {
      testY = block.y;
    } else if (this.y > block.y + block.height) {
      testY = block.y + block.height;
    }

    const distX = this.x - testX;
    const distY = this.y - testY;

    const distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

    if (distance <= this.radius) {
      if (
        this.y + this.radius / 2 >= block.y &&
        this.y - this.radius / 2 <= block.y + block.height
      ) {
        return 'x';
      } else {
        return 'y';
      }
    }
  };

  changeDirection = (axis: 'x' | 'y', direction?: -1 | 1) => {
    const key = `direction${axis.toUpperCase()}`;
    this[key] = direction || -this[key];
  };
}
