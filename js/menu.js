const startScreen = document.getElementById('start-screen');
const trackScreen = document.getElementById('track-screen');
const gameScreen = document.querySelector('.game');
const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restart-button');
const startButton = document.getElementById('start-button');
const classicButton = document.getElementById('classic-button');
const snowyButton = document.getElementById('snowy-button');
const endlessButton = document.getElementById('endless-button');
const normalButton = document.getElementById('normal-button');


startButton.addEventListener('click', function () {
    startScreen.classList.add('hidden');
    trackScreen.classList.remove('hidden');

});


classicButton.addEventListener('click', function () {

    startGame('classic');

});


snowyButton.addEventListener('click', function () {

    startGame('snowy');

});

function startGame(track) {

    trackScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    window.dispatchEvent(new CustomEvent('game:start', { detail: { track } }));

}

export function showGameOver() {

    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');

}

restartButton.addEventListener('click', function () {
    location.reload();
});