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

  let isStarted = false;
  let isPaused = false;

  button.addEventListener('click', () => {
    if (!isStarted) {
      game.start();
    } else if (isPaused) {
      game.resume();
    } else {
      game.pause();
    }
  });

  game
    .on('start', () => {
      isStarted = true;
      isPaused = false;
      button.innerText = 'Pause';
      status.innerHTML = 'Status: Playing';
    })
    .on('pause', () => {
      isPaused = true;
      button.innerText = 'Resume';
      status.innerHTML = 'Status: Paused';
    })
    .on('resume', () => {
      isPaused = false;
      button.innerText = 'Pause';
      status.innerHTML = 'Status: Playing';
    })
    .on('won', () => {
      isPaused = false;
      button.innerText = 'Pause';
    })
    .on('lose', () => {
      isStarted = false;
      isPaused = false;
      button.innerText = 'Start';
      status.innerHTML = 'Status: Lose';
    })
    .on('score', () => (score.innerText = `Score: ${game.score}`))
    .on('level', () => (level.innerText = `Level: ${game.level}`))
    .on('hit', () => playEffect('hit'));
}

init();
