import { state } from './variables/state.js';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT
} from './variables/variable.js';

import {
    createRoad,
    drawRoad
} from './background/road.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

createRoad();

function update() {

}

function draw() {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawRoad(ctx);
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();