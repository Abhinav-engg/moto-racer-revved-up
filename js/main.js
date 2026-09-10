import { state } from './variables/state.js';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    MAX_SPEED,
    ACCEL,
    BRAKE,
    DECEL
} from './variables/variable.js';
import { drawGrass } from './background/grass.js';
import { inputState, setupInputs } from './inputs/inputs.js';
import {
    updateRoad,
    drawRoad,
    drawRoadShoulders,
    drawLaneMarkings
} from './background/road.js';

import { drawPlayer, updatePlayer } from './play/player.js';
import { checkCollision, drawCoins } from './play/collision.js';
import { calculateScore, isRaceComplete } from './play/play.js';

import {
    buildTrack
} from './background/track.js';
import { drawScenery, buildForest } from './background/scenery.js';
import { drawSky } from './background/sky.js';
import { showGameOver } from './menu.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const timerValue = document.getElementById('timer');
const lapValue = document.getElementById('lap');
const nitroFill = document.getElementById('nitro-fill');
const coinsValue = document.getElementById('coins');
const raceCompleteModal = document.getElementById('race-complete');
const finalCoins = document.getElementById('final-coins');
const finalLives = document.getElementById('final-lives');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let timeLeft = 300;
let gameOver = false;

const bgMusic = new Audio('assets/sfx/backgroundmusic.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;

const bikeSound = new Audio('assets/sfx/bikeriding.mp3');
bikeSound.loop = true;
bikeSound.volume = 0.5;

const nitroSound = new Audio('assets/sfx/20-sec nitro.mp3');
nitroSound.loop = true;
nitroSound.volume = 0.6;

const lapSound = new Audio('assets/sfx/lap-complete.mp3');
lapSound.volume = 0.8;

const crashSound = new Audio('assets/sfx/small_crash.mp3');
crashSound.volume = 0.8;

let lastLap = state.lap;
let lastLives = state.lives;

window.addEventListener('keydown', () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
    }
}, { once: true });

window.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
    }
}, { once: true });

if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        state.lap = 0;
        state.coins = 0;
        state.lives = 3;
        state.speed = 0;
        state.nitro = 100;
        state.cameraZ = 0;
        state.playerX = 0;
        lastLap = 0;
        lastLives = 3;
        timeLeft = 300;
        gameOver = false;
        if (raceCompleteModal) {
            raceCompleteModal.classList.add('hidden');
        }
        updateLives();
        updateCoins();
        updateLap();
        updateNitro();
    });
}

function updateTimer(deltaTime) {
    timeLeft = Math.max(0, timeLeft - deltaTime);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft % 60);
    if (timerValue) {
        timerValue.textContent = `${minutes}:${seconds}`;
    }
}

function updateLap() {
    if (state.lap > lastLap) {
        lapSound.currentTime = 0;
        lapSound.play().catch(() => {});
        lastLap = state.lap;
    }
    if (lapValue) {
        lapValue.textContent = `${String(Math.min(3, state.lap))}/03`;
    }
}

function updateNitro() {
    if (nitroFill) {
        nitroFill.style.width = `${Math.max(0, Math.min(100, state.nitro))}%`;
    }
}

function updateLives() {
    if (state.lives < lastLives) {
        crashSound.currentTime = 0;
        crashSound.play().catch(() => {});
        lastLives = state.lives;
    }
    const hearts = document.querySelectorAll('#lives .heart');
    hearts.forEach((heart, index) => {
        if (index < state.lives) {
            heart.classList.remove('lost');
        } else {
            heart.classList.add('lost');
        }
    });
}

function updateCoins() {
    if (coinsValue) {
        coinsValue.textContent = String(state.coins);
    }
}

function updateSpeed(deltaTime) {
    let currentAccel = ACCEL;

    if (inputState.accelerate) {
        if (bikeSound.paused) {
            bikeSound.play().catch(() => {});
        }
    } else {
        if (!bikeSound.paused) {
            bikeSound.pause();
            bikeSound.currentTime = 0;
        }
    }

    if (inputState.nitro && state.nitro > 0) {
        if (nitroSound.paused) {
            nitroSound.play().catch(() => {});
        }
        currentAccel = ACCEL * 2;
        state.nitro = Math.max(0, state.nitro - 30 * deltaTime);
    } else {
        if (!nitroSound.paused) {
            nitroSound.pause();
            nitroSound.currentTime = 0;
        }
    }

    if (inputState.accelerate || (inputState.nitro && state.nitro > 0)) {
        state.speed += currentAccel * deltaTime;
    }

    if (inputState.brake) {
        state.speed -= BRAKE * deltaTime;
    }

    if (!inputState.accelerate && !inputState.brake && !(inputState.nitro && state.nitro > 0)) {
        state.speed -= DECEL * deltaTime;
    }

    const currentMax = (inputState.nitro && state.nitro > 0) ? MAX_SPEED * 1.4 : MAX_SPEED;
    state.speed = Math.max(0, Math.min(currentMax, state.speed));
}

function checkGameEnd() {
    if (isRaceComplete(state.lap) && !gameOver) {
        gameOver = true;
        if (!bikeSound.paused) {
            bikeSound.pause();
            bikeSound.currentTime = 0;
        }
        if (!nitroSound.paused) {
            nitroSound.pause();
            nitroSound.currentTime = 0;
        }
        if (finalCoins) {
            finalCoins.textContent = String(state.coins);
        }
        if (finalLives) {
            finalLives.textContent = String(state.lives);
        }
        if (finalScore) {
            finalScore.textContent = String(calculateScore(state.coins, state.lives));
        }
        if (raceCompleteModal) {
            raceCompleteModal.classList.remove('hidden');
        }
    }
}

function update(deltaTime) {
    if (gameOver) {
        return;
    }

    updateSpeed(deltaTime);

    updateRoad(deltaTime);
    updatePlayer(deltaTime);
    checkCollision(deltaTime);

    updateTimer(deltaTime);
    updateLap();
    updateNitro();
    updateLives();

    if (state.lives <= 0) {
        gameOver = true;
        if (!bikeSound.paused) {
            bikeSound.pause();
            bikeSound.currentTime = 0;
        }
        if (!nitroSound.paused) {
            nitroSound.pause();
            nitroSound.currentTime = 0;
        }
        showGameOver();
    }
    updateCoins();
    checkGameEnd();
}

function draw() {
    drawSky(ctx);
    drawGrass(ctx);
    drawScenery(ctx);
    drawRoadShoulders(ctx);
    drawRoad(ctx);
    drawLaneMarkings(ctx);
    drawCoins(ctx);
    drawPlayer(ctx);
}

let lastTime = performance.now();
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

let gameStarted = false;

window.addEventListener('game:start', () => {
    if (gameStarted) {
        return;
    }

    gameStarted = true;
    buildTrack();
    buildForest();
    setupInputs();
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
});

