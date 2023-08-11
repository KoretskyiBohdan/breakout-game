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

  isCollision(shape: Shape) {
    const { position, height, width } = this;

    const isCollision =
      position.y + height >= shape.position.y &&
      position.y <= shape.position.y + shape.height &&
      position.x >= shape.position.x &&
      position.x - width <= shape.position.x + shape.width;

    return isCollision;
  }
}
