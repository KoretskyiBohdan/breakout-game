type CB = () => unknown;

export type ConfigType = {
  START?: CB;
  NEW?: CB;
};

export class Controls {
  private root: HTMLDivElement;
  private config: ConfigType;
  private isRunnig: boolean;

  constructor(root: HTMLElement, config: ConfigType) {
    this.root = root.getElementsByClassName('controls')?.[0] as HTMLDivElement;
    this.config = config;
    this.isRunnig = false;
    this.root.addEventListener('click', this.onClick);
    this.render();
  }

  setIsRuning(flag: boolean) {
    this.isRunnig = flag;
    this.render();
  }

  render() {
    if (!this.root) return;

    this.root.innerHTML = '';

    const type = this.isRunnig ? 'NEW' : 'START';

    const b = document.createElement('button');
    b.type = 'button';
    b.name = type;
    b.innerHTML = type;
    this.root.appendChild(b);
  }

  onClick = (event: Event) => {
    const { config } = this;
    const { name } = event.target as HTMLButtonElement;

    if (typeof config[name] === 'function') config[name]();
  };
}
