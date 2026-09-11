import { state } from '../variables/state.js';
import { buildTrack } from '../background/track.js';
import { buildForest } from '../background/scenery.js';
import { setupInputs } from '../inputs/inputs.js';
import { updateGame } from './update.js';
import { drawGame } from './draw.js';
import { setupAudioUnlock } from './audio.js';

let gameStarted = false;
let lastTime = performance.now();

export function startGame(ctx, track) {
	if (gameStarted) return;

	gameStarted = true;
	state.track = track === 'snowy' ? 'snowy' : 'classic';
	buildTrack();
	buildForest();
	setupInputs();
	setupAudioUnlock();
	lastTime = performance.now();
	requestAnimationFrame((time) => gameLoop(time, ctx));
}

function gameLoop(currentTime, ctx) {
	const deltaTime = (currentTime - lastTime) / 1000;
	lastTime = currentTime;
	updateGame(deltaTime);
	drawGame(ctx);
	requestAnimationFrame((time) => gameLoop(time, ctx));
}
