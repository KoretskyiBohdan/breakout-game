import { Game } from './Game';

function init() {
  const game = new Game(document.querySelector('canvas') as HTMLCanvasElement);
  const button = document.querySelector('button') as HTMLButtonElement;
  const level = document.querySelector('.level') as HTMLDivElement;
  const score = document.querySelector('.score') as HTMLDivElement;
  const status = document.querySelector('.status') as HTMLDivElement;

  button.addEventListener('click', game.start);

  game
    .on(
      'start',
      () => (button.innerText = 'New') && (status.innerHTML = 'Status: Playing')
    )
    .on('won', () => (button.innerText = 'Start'))
    .on('lose', () => {
      button.innerText = 'Start';
      status.innerHTML = 'Status: Lose';
    })
    .on('score', () => (score.innerText = `Score: ${game.score}`))
    .on('level', () => (level.innerText = `Level: ${game.level}`));
}

init();
