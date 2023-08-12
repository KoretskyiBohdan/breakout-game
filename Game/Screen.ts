import { BaseShape } from './BaseShape';

export type ScreenOptions = {
  width: number;
  height: number;
};

export class Screen<R extends HTMLElement> {
  private root: R;
  private canvas: HTMLCanvasElement;
  private options: ScreenOptions;

  constructor(root: R, options: ScreenOptions) {
    this.root = root;
    this.options = options;

    this.init();
  }

  private init() {
    const { width, height } = this.options;
    const canvas = this.root.getElementsByTagName('canvas')[0];

    if (!canvas) throw new Error('Cannot find canvas element!');

    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;
  }

  draw(nodes: BaseShape[]) {
    const { width, height } = this.options;
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const { position } = node;

      ctx.beginPath();
      ctx.fillStyle = node.color;

      if (node.type === 'rect') {
        ctx.fillRect(position.x, position.y, node.width, node.height);
      }
      if (node.type === 'ball') {
        ctx.arc(position.x, position.y, node.height / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.closePath();
    }
  }
}
