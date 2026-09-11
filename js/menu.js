import { toggleMute, toggleMusic } from './game/audio.js';

const startScreen = document.getElementById('start-screen');
const instructionScreen = document.getElementById('instruction-screen');
const trackScreen = document.getElementById('track-screen');
const gameScreen = document.querySelector('.game');
const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restart-button');
const startButton = document.getElementById('start-button');
const instructionButton = document.getElementById('instruction-button');
const instructionBackButton = document.getElementById('instruction-back-button');
const classicButton = document.getElementById('classic-button');
const snowyButton = document.getElementById('snowy-button');
const endlessButton = document.getElementById('endless-button');
const normalButton = document.getElementById('normal-button');
const muteButton = document.getElementById('mute');
const musicOffButton = document.getElementById('music-off');


startButton.addEventListener('click', function () {
    startScreen.classList.add('hidden');
    trackScreen.classList.remove('hidden');

});

instructionButton.addEventListener('click', function () {
    startScreen.classList.add('hidden');
    instructionScreen.classList.remove('hidden');
});

instructionBackButton.addEventListener('click', function () {
    instructionScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
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

muteButton.addEventListener('click', function () {
    const muted = toggleMute();
    muteButton.querySelector('img').style.opacity = muted ? '0.4' : '1';
});

musicOffButton.addEventListener('click', function () {
    const off = toggleMusic();
    musicOffButton.querySelector('img').style.opacity = off ? '0.4' : '1';
});