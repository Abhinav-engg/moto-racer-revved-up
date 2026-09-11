import { CANVAS_WIDTH, CANVAS_HEIGHT } from './variables/variable.js';
import { startGame } from './game/game.js';
import './menu.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

window.addEventListener('game:start', (event) => {
    startGame(ctx, event.detail?.track);
});
