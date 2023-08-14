type Callback = () => void;

export class Events<T extends string = string> {
  events: { [key in T]?: Callback[] } = {};

  on = (name: T, cb: Callback) => {
    (this.events[name] = this.events[name] || []).push(cb);
    return this;
  };

  emit = (name: T) => {
    (this.events[name] || []).forEach((cb) => cb());
  };
}
