export type AudioTypes = 'hit' | 'won' | 'lose';

export class Sound {
  private sounds: HTMLAudioElement[];

  constructor(root: HTMLElement) {
    this.sounds = Array.from(root.getElementsByTagName('audio'));
  }

  play = (t: AudioTypes) => {
    this.sounds.forEach(async ({ src, dataset }) => {
      const { type } = dataset;
      if (t === type) {
        const a = new Audio(src);
        a.currentTime = 0.05;
        // todo: replace sounds
        //await a.play();
      }
    });
  };
}
