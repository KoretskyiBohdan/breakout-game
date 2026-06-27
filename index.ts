import { Game } from './Game';

async function init() {
  const game = new Game(document.querySelector('canvas') as HTMLCanvasElement);
  const button = document.querySelector('button') as HTMLButtonElement;
  const level = document.querySelector('.level') as HTMLDivElement;
  const score = document.querySelector('.score') as HTMLDivElement;
  const status = document.querySelector('.status') as HTMLDivElement;
  const effects = [...document.querySelectorAll('audio')];

  const playEffect = async (name: string) => {
    const el = effects.find(({ dataset }) => dataset.name === name);
    if (!el) return;
    el.currentTime = 0;
    await el.play();
  };

  button.addEventListener('click', game.start);

  game
    .on('start', () => {
      button.innerText = 'New';
      status.innerHTML = 'Status: Playing';
    })
    .on('won', () => (button.innerText = 'Start'))
    .on('lose', () => {
      button.innerText = 'Start';
      status.innerHTML = 'Status: Lose';
    })
    .on('score', () => (score.innerText = `Score: ${game.score}`))
    .on('level', () => (level.innerText = `Level: ${game.level}`))
    .on('hit', () => playEffect('hit'));
}

init();
