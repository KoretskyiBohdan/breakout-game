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

    nodes.forEach((node) => {
      ctx.beginPath();
      node.draw(ctx);
      ctx.closePath();
    });
  };
}
