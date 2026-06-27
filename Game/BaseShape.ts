export type ShapeOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export abstract class BaseShape {
  x: ShapeOptions['x'];
  y: ShapeOptions['y'];
  width: ShapeOptions['width'];
  height: ShapeOptions['height'];
  color: ShapeOptions['color'];

  constructor(options: ShapeOptions) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.color = options.color;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;

  abstract reset(): void;
}
