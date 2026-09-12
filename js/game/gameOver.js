import { state } from '../variables/state.js';
import { calculateScore, isRaceComplete } from '../play/play.js';
import { showGameOver } from '../menu.js';
import { resetHud } from './hud.js';
import { stopRaceAudio } from './audio.js';

const raceCompleteModal = document.getElementById('race-complete');
const finalCoins = document.getElementById('final-coins');
const finalLives = document.getElementById('final-lives');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-btn');

export function checkGameEnd() {
	if (state.lives <= 0 && !state.gameOver) {
		state.gameOver = true;
		stopRaceAudio();
		showGameOver();
		return;
	}

	if (state.mode !== 'endless' && state.timeLeft == 0 && !state.gameOver) {
		state.gameOver = true;
		stopRaceAudio();
		showGameOver();
		return;
	}

	if (state.mode !== 'endless' && isRaceComplete(state.lap) && !state.gameOver) {
		state.gameOver = true;
		stopRaceAudio();
		if (finalCoins) finalCoins.textContent = String(state.coins);
		if (finalLives) finalLives.textContent = String(state.lives);
		if (finalScore) finalScore.textContent = String(calculateScore(state.coins, state.lives));
		if (raceCompleteModal) raceCompleteModal.classList.remove('hidden');
	}
}

export function resetGame() {
	state.lap = 0;
	state.coins = 0;
	state.lives = 3;
	state.speed = 0;
	state.nitro = 100;
	state.cameraZ = 0;
	state.playerX = 0;
	state.timeLeft = 300;
	state.elsapedTime = 0;
	state.gameOver = false;
	if (raceCompleteModal) raceCompleteModal.classList.add('hidden');
	resetHud();
}

if (restartButton) restartButton.addEventListener('click', resetGame);
