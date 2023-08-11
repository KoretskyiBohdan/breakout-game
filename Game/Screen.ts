import { Shape } from './Shape';

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
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.bottom = '0';
    canvas.style.left = '0';
    canvas.style.right = '0';
    canvas.style.margin = 'auto';
    canvas.style.border = '1px solid #000';

    this.canvas = canvas;
    this.root.appendChild(this.canvas);
  }

  draw(nodes: Shape[]) {
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
        ctx.arc(position.x, position.y, node.height, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.closePath();
    }
  }
}
