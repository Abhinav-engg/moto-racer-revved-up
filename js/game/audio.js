const bgMusic = new Audio('assets/sfx/backgroundmusic.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;

const bikeSound = new Audio('assets/sfx/bikeriding.mp3');
bikeSound.loop = true;
bikeSound.volume = 0.5;

const nitroSound = new Audio('assets/sfx/20-sec nitro.mp3');
nitroSound.loop = true;
nitroSound.volume = 0.6;

const lapSound = new Audio('assets/sfx/lap-complete.mp3');
lapSound.volume = 0.8;

const crashSound = new Audio('assets/sfx/small_crash.mp3');
crashSound.volume = 0.8;

function play(sound) {
	sound.play().catch(() => {});
}

function stop(sound) {
	sound.pause();
	sound.currentTime = 0;
}

export function setupAudioUnlock() {
	const unlock = () => {
		if (bgMusic.paused) play(bgMusic);
	};

	window.addEventListener('keydown', unlock, { once: true });
	window.addEventListener('click', unlock, { once: true });
}

export function updateBikeSound(isAccelerating) {
	if (isAccelerating) {
		if (bikeSound.paused) play(bikeSound);
		return;
	}
	if (!bikeSound.paused) stop(bikeSound);
}

export function updateNitroSound(isUsingNitro) {
	if (isUsingNitro) {
		if (nitroSound.paused) play(nitroSound);
		return;
	}
	if (!nitroSound.paused) stop(nitroSound);
}

export function playLapSound() {
	lapSound.currentTime = 0;
	play(lapSound);
}

export function playCrashSound() {
	crashSound.currentTime = 0;
	play(crashSound);
}

export function stopRaceAudio() {
	stop(bikeSound);
	stop(nitroSound);
}
