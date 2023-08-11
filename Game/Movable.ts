import { Shape, ShapePosition, ShapeOptions } from './Shape';
import { SCREEN_WIDTH } from './constants';

export class Movable extends Shape {
  constructor(position: ShapePosition, options: ShapeOptions) {
    super(position, options);
  }

  moveX(val: number) {
    const { position, width } = this;
    position.x = Math.max(Math.min(position.x + val, SCREEN_WIDTH - width), 0);
  }

  moveY(val: number) {
    console.log('move Y');
  }
}
