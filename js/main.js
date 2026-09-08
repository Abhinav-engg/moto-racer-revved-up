import { state } from './variables/state.js';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT
} from './variables/variable.js';

import {
    createRoad,
    drawRoad,
    updateRoad
} from './background/road.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');



createRoad();

state.speed = 300;

function update(deltaTime) {
    updateRoad(deltaTime);

}

function draw() {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawRoad(ctx);
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