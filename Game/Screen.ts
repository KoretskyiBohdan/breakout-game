import { BaseShape } from './BaseShape';

export type ScreenOptions = {
  width: number;
  height: number;
  onUpdate: () => unknown;
};

export class Screen<R extends HTMLElement> {
  private root: R;
  private canvas: HTMLCanvasElement;
  private options: ScreenOptions;
  private animationFrameId: number;

  constructor(root: R, options: ScreenOptions) {
    this.root = root;
    this.options = options;

    this.init();
  }

  private init = () => {
    const { width, height } = this.options;
    const canvas = this.root.getElementsByTagName('canvas')[0];

    if (!canvas) throw new Error('Cannot find canvas element!');

    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;
  };

  enableRefresh = () => {
    const perform = () => {
      if (typeof this.options.onUpdate === 'function') {
        this.options.onUpdate();
      }
      this.animationFrameId = requestAnimationFrame(perform);
    };

    perform();
  };

  disableRefresh = () => {
    window.cancelAnimationFrame(this.animationFrameId);
  };

  draw = (nodes: BaseShape[]) => {
    const { width, height } = this.options;
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      ctx.beginPath();
      ctx.fillStyle = node.color;

      ctx.globalAlpha = node.opticity;

      if (node.type === 'rect') {
        ctx.fillRect(node.x, node.y, node.width, node.height);
      }
      if (node.type === 'ball') {
        ctx.arc(node.x, node.y, node.height / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.closePath();
    }
  };
}
