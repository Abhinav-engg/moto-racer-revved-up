import { state } from '../variables/state.js';
import { buildTrack } from '../background/track.js';
import { buildForest } from '../background/scenery.js';
import { setupInputs } from '../inputs/inputs.js';
import { updateGame } from './update.js';
import { drawGame } from './draw.js';
import { setupAudioUnlock, stopRaceAudio } from './audio.js';
import { setBikeSprite } from '../play/player.js';
import { initOpponents } from '../play/opponent.js';

let gameStarted = false;
let lastTime = performance.now();
let animationFrameId = null;

export function startGame(ctx, track, bike) {
	if (gameStarted) return;

	gameStarted = true;
	state.gameOver = false;
	state.track = track === 'snowy' ? 'snowy' : 'classic';
	setBikeSprite(bike || 'bike-black');
	buildTrack();
	buildForest();
	initOpponents();
	setupInputs();
	setupAudioUnlock();
	lastTime = performance.now();
	animationFrameId = requestAnimationFrame((time) => gameLoop(time, ctx));
}

export function stopGame() {
	gameStarted = false;
	state.gameOver = true;
	stopRaceAudio();
	if (animationFrameId !== null) {
		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;
	}
}

window.addEventListener('game:back', stopGame);

function gameLoop(currentTime, ctx) {
	const deltaTime = (currentTime - lastTime) / 1000;
	lastTime = currentTime;
	updateGame(deltaTime);
	drawGame(ctx);
	animationFrameId = requestAnimationFrame((time) => gameLoop(time, ctx));
}
