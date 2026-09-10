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

import {
    buildTrack
} from './background/track.js';
import { drawScenery, buildForest } from './background/scenery.js';
import { drawSky } from './background/sky.js';
import './menu.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const timerValue = document.getElementById('timer');
const lapValue = document.getElementById('lap');
const nitroFill = document.getElementById('nitro-fill');
const coinsValue = document.getElementById('coins');
let timeLeft = 300;

function updateTimer(deltaTime) {
    timeLeft = Math.max(0, timeLeft - deltaTime);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft % 60);
    if (timerValue) {
        timerValue.textContent = `${minutes}:${seconds}`;
    }
}

function updateLap() {
    if (lapValue) {
        lapValue.textContent = `${String(state.lap)}/03`;
    }
}

function updateNitro() {
    if (nitroFill) {
        nitroFill.style.width = `${Math.min(100, state.nitro)}%`;
    }
}

function updateLives() {
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
    if (inputState.accelerate) {
        state.speed += ACCEL * deltaTime;
    }

    if (inputState.brake) {
        state.speed -= BRAKE * deltaTime;
    }

    if (!inputState.accelerate && !inputState.brake) {
        state.speed -= DECEL * deltaTime;
    }

    state.speed = Math.max(0, Math.min(MAX_SPEED, state.speed));
}

function update(deltaTime) {
    updateRoad(deltaTime);
    updatePlayer(deltaTime);
    checkCollision(deltaTime);
    updateTimer(deltaTime);
    updateLap();
    updateNitro();
    updateLives();
    updateCoins();
    updateSpeed(deltaTime);
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
