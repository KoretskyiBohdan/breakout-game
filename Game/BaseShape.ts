export type ShapePosition = {
  x: number;
  y: number;
};

export type ShapeOptions = {
  width: number;
  height: number;
  type: 'rect' | 'ball';
  color: string;
};

export class BaseShape {
  position: ShapePosition;
  width: ShapeOptions['width'];
  height: ShapeOptions['height'];
  type: ShapeOptions['type'];
  color: ShapeOptions['color'];
  opticity = 1;

  constructor(position: ShapePosition, options: ShapeOptions) {
    this.position = position;
    Object.assign(this, options);
  }
}
