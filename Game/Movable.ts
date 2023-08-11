import { Shape, ShapePosition, ShapeOptions } from './Shape';

export class Movable extends Shape {
  constructor(position: ShapePosition, options: ShapeOptions) {
    super(position, options);
  }

  moveX(val: number) {
    const { position } = this;
    position.x = val;
  }

  moveY(val: number) {
    const { position } = this;
    position.y = val;
  }
}
