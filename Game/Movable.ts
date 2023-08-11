import { Shape, ShapePosition, ShapeOptions } from './Shape';

export class Movable extends Shape {
  constructor(position: ShapePosition, options: ShapeOptions) {
    super(position, options);
  }

  moveX() {
    console.log('move X');
  }

  moveY() {
    console.log('move Y');
  }
}
