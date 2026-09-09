import { state } from './variables/state.js';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT
} from './variables/variable.js';
import { drawGrass } from './background/grass.js';
import { inputState, setupInputs } from './inputs/inputs.js';
import {
    createRoad,
    updateRoad,
    drawRoad,
    drawRoadShoulders,
    drawLaneMarkings,
    addHill

} from './background/road.js';
import { drawPlayer, updatePlayer } from './play/player.js';

import {
    buildTrack
} from './background/track.js';



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const timerValue = document.getElementById('timer');
const lapValue = document.getElementById('lap');
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
        lapValue.textContent = `${String(state.lap).padStart(2, '0')}/03`;
    }
}

buildTrack();
setupInputs();

state.speed = 3000;

function update(deltaTime) {
    updateRoad(deltaTime);
    updatePlayer(deltaTime);
    updateTimer(deltaTime);
    updateLap();
}

function draw() {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawGrass(ctx);
    drawRoadShoulders(ctx);
    drawRoad(ctx);
    drawLaneMarkings(ctx);
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

requestAnimationFrame(gameLoop);
