import { state } from '../variables/state.js';
import { MAX_SPEED } from '../variables/variable.js';
import { playCrashSound, playLapSound } from './audio.js';

const timerValue = document.getElementById('timer');
const lapValue = document.getElementById('lap');
const nitroFill = document.getElementById('nitro-fill');
const coinsValue = document.getElementById('coins');
const speedValue = document.getElementById('speed');
const bestDistanceValue = document.getElementById('best-distance');
const distanceValue = document.getElementById('distance');
const bestLapValue = document.getElementById('best-lap');

const MAX_DISPLAY_KMH = 250;
let lapStartTime = 0;
let lastLap = state.lap;
let lastLives = state.lives;
let bestLap = parseFloat(localStorage.getItem('bestLap')) || 0;
if (bestLap != null) {
    bestLap = Number(bestLap);
}


let bestDistance = Number(
	localStorage.getItem('bestDistance')
) || 0;

export function updateHud(deltaTime) {
	updateTimer(deltaTime);
	updateLap();
	updateNitro();
	updateLives();
	updateCoins();
	updateSpeed();
	updateDistance(deltaTime);
	updateBestDistance();
}

function updateTimer(deltaTime) {
    state.elsapedTime += deltaTime;
    if (state.mode == 'endless') {
        if (timerValue) {
            timerValue.textContent =
                state.elsapedTime.toFixed(2);
        }

    } else {

        state.timeLeft = Math.max(
            0,
            state.timeLeft - deltaTime
        );

        const minutes = Math.floor(state.timeLeft / 60);
        const seconds = Math.floor(state.timeLeft % 60);

        if (timerValue) {
            timerValue.textContent =
                `${minutes}:${String(seconds).padStart(2, '0')}`;
        }
    }
}

export function updateLap() {

    if (state.lap > lastLap) {

        playLapSound();
        const lapTime = state.elsapedTime - lapStartTime;
        if (bestLap === null || lapTime < bestLap) {

            bestLap = lapTime;
            localStorage.setItem('bestLap',bestLap);
        }

        
        lapStartTime = state.elsapedTime;

        lastLap = state.lap;
    }

    if (lapValue) {
        lapValue.textContent = state.mode == 'endless'
            ? '∞'
            : `${String(Math.min(3, state.lap))}/03`;
    }

    updateBestLapDisplay();
}

function updateBestLapDisplay() {

    if (bestLapValue) {
        bestLapValue.textContent =
            formatLapTime(bestLap);
    }
}

function formatLapTime(seconds) {
    if (seconds === null) {
        return '--:--.--';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${remainingSeconds.toFixed(2).padStart(5, '0')}`;
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

function updateSpeed() {
	const kmh = Math.round((state.speed / MAX_SPEED) * MAX_DISPLAY_KMH);
	if (speedValue) speedValue.textContent = `${kmh} km/h`;
}

function updateBestDistance() {
	if (state.mode !== 'endless') {
		if (bestDistanceValue) {
			bestDistanceValue.parentElement.style.display = 'none';
		}
		return;
	}

	if (bestDistanceValue) {
		bestDistanceValue.parentElement.style.display = 'flex';
	}

	if (state.distance > bestDistance) {
		bestDistance = state.distance;

		localStorage.setItem(
			'bestDistance',
			bestDistance.toString()
		);
	}

	if (bestDistanceValue) {
		bestDistanceValue.textContent =
			`${bestDistance.toFixed(2)} km`;
	}
}

function updateDistance(deltaTime) {
	const kmPerFrame = (state.speed / MAX_SPEED) * MAX_DISPLAY_KMH * (deltaTime / 3600);
	state.distance += kmPerFrame;
	if (distanceValue) distanceValue.textContent = `${state.distance.toFixed(2)} km`;
}

export function resetHud() {
	lastLap = state.lap;
	lastLives = state.lives;
	lapStartTime = 0;
	updateLap();
	updateNitro();
	updateLives();
	updateCoins();
	updateBestLapDisplay();
	if (timerValue) timerValue.textContent = state.mode == 'endless' ? '0.00' : '5:00';
	if (speedValue) speedValue.textContent = '0 km/h';
	if (distanceValue) distanceValue.textContent = '0.00 km';

	updateBestDistance();
}
