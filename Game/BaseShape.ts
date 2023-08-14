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
    Object.assign(this, options);
  }

  abstract draw: (ctx: CanvasRenderingContext2D) => void;
}
