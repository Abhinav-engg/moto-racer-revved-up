import { state } from '../variables/state.js';
import { playCrashSound, playLapSound } from './audio.js';

const timerValue = document.getElementById('timer');
const lapValue = document.getElementById('lap');
const nitroFill = document.getElementById('nitro-fill');
const coinsValue = document.getElementById('coins');

let lastLap = state.lap;
let lastLives = state.lives;

export function updateHud(deltaTime) {
	updateTimer(deltaTime);
	updateLap();
	updateNitro();
	updateLives();
	updateCoins();
}

function updateTimer(deltaTime) {
	state.timeLeft = Math.max(0, state.timeLeft - deltaTime);
	const minutes = Math.floor(state.timeLeft / 60);
	const seconds = Math.floor(state.timeLeft % 60);
	if (timerValue) timerValue.textContent = `${minutes}:${seconds}`;
}

export function updateLap() {
	if (state.lap > lastLap) {
		playLapSound();
		lastLap = state.lap;
	}
	if (lapValue) lapValue.textContent = `${String(Math.min(3, state.lap))}/03`;
}

export function updateNitro() {
	if (nitroFill) {
		nitroFill.style.width = `${Math.max(0, Math.min(100, state.nitro))}%`;
	}
}

export function updateLives() {
	if (state.lives < lastLives) {
		playCrashSound();
		lastLives = state.lives;
	}
	const hearts = document.querySelectorAll('#lives .heart');
	hearts.forEach((heart, index) => heart.classList.toggle('lost', index >= state.lives));
}

export function updateCoins() {
	if (coinsValue) coinsValue.textContent = String(state.coins);
}

export function resetHud() {
	lastLap = state.lap;
	lastLives = state.lives;
	updateLap();
	updateNitro();
	updateLives();
	updateCoins();
	if (timerValue) timerValue.textContent = '5:00';
}
