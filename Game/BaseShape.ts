export type ShapeOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'rect' | 'ball';
  color: string;
};

export class BaseShape {
  x: ShapeOptions['x'];
  y: ShapeOptions['y'];
  width: ShapeOptions['width'];
  height: ShapeOptions['height'];
  type: ShapeOptions['type'];
  color: ShapeOptions['color'];
  opticity = 1;

  constructor(options: ShapeOptions) {
    Object.assign(this, options);
  }
}
