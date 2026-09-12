import { toggleMute, toggleMusic } from './game/audio.js';
import { state } from './variables/state.js';
import { startGame } from './game/game.js';

const startScreen = document.getElementById('start-screen');
const instructionScreen = document.getElementById('instruction-screen');
const selectScreen = document.getElementById('select-screen');
const gameScreen = document.querySelector('.game');
const gameOverScreen = document.getElementById('game-over-screen');

const startButton = document.getElementById('start-button');
const instructionButton = document.getElementById('instruction-button');
const instructionBackButton = document.getElementById('instruction-back-button');
const playButton = document.getElementById('play-button');
const restartButton = document.getElementById('restart-button');
const muteButton = document.getElementById('mute');
const musicOffButton = document.getElementById('music-off');
const backButton = document.getElementById('back');

const modeTimed = document.getElementById('mode-timed');
const modeEndless = document.getElementById('mode-endless');
const trackClassic = document.getElementById('track-classic');
const trackSnowy = document.getElementById('track-snowy');
const bikeBlack = document.getElementById('bike-black');
const bikeWhite = document.getElementById('bike-white');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let selectedMode = localStorage.getItem('selectedMode') || 'timed';
let selectedTrack = localStorage.getItem('selectedTrack') || 'classic';
let selectedBike = localStorage.getItem('selectedBike') || 'bike-black';

updateSelectionUI();

function updateSelectionUI() {
    if (selectedMode === 'timed') {
        modeTimed.classList.add('selected');
        modeEndless.classList.remove('selected');
    } else {
        modeEndless.classList.add('selected');
        modeTimed.classList.remove('selected');
    }

    if (selectedTrack === 'classic') {
        trackClassic.classList.add('selected');
        trackSnowy.classList.remove('selected');
    } else {
        trackSnowy.classList.add('selected');
        trackClassic.classList.remove('selected');
    }

    if (selectedBike === 'bike-black') {
        bikeBlack.classList.add('selected');
        bikeWhite.classList.remove('selected');
    } else {
        bikeWhite.classList.add('selected');
        bikeBlack.classList.remove('selected');
    }
}

startButton.addEventListener('click', function () {
    startScreen.classList.add('hidden');
    selectScreen.classList.remove('hidden');
});

instructionButton.addEventListener('click', function () {
    startScreen.classList.add('hidden');
    instructionScreen.classList.remove('hidden');
});

instructionBackButton.addEventListener('click', function () {
    instructionScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});

modeTimed.addEventListener('click', function () {
    selectedMode = 'timed';
    localStorage.setItem('selectedMode', 'timed');
    updateSelectionUI();
});

modeEndless.addEventListener('click', function () {
    selectedMode = 'endless';
    localStorage.setItem('selectedMode', 'endless');
    updateSelectionUI();
});

trackClassic.addEventListener('click', function () {
    selectedTrack = 'classic';
    localStorage.setItem('selectedTrack', 'classic');
    updateSelectionUI();
});

trackSnowy.addEventListener('click', function () {
    selectedTrack = 'snowy';
    localStorage.setItem('selectedTrack', 'snowy');
    updateSelectionUI();
});

bikeBlack.addEventListener('click', function () {
    selectedBike = 'bike-black';
    localStorage.setItem('selectedBike', 'bike-black');
    updateSelectionUI();
});

bikeWhite.addEventListener('click', function () {
    selectedBike = 'bike-white';
    localStorage.setItem('selectedBike', 'bike-white');
    updateSelectionUI();
});

playButton.addEventListener('click', function () {
    state.mode = selectedMode;

    selectScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    startGame(ctx, selectedTrack, selectedBike);
});

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

backButton.addEventListener('click', function () {
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    selectScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    window.dispatchEvent(new Event('game:back'));
});
