import { state } from '../variables/state.js';
import { inputState } from '../inputs/inputs.js';
import { ACCEL, BRAKE, DECEL, MAX_SPEED } from '../variables/variable.js';
import { updateBikeSound, updateNitroSound } from './audio.js';

export function updateSpeed(deltaTime) {
    let currentAccel = ACCEL;
    const usingNitro = inputState.nitro && state.nitro > 0;
    updateBikeSound(inputState.accelerate);
    updateNitroSound(usingNitro);

    if (usingNitro) {
        currentAccel = ACCEL * 2;
        const drainRate = state.track === 'classic' ? 30 : 5;
        state.nitro = Math.max(0, state.nitro - drainRate * deltaTime);
    }

    if (inputState.accelerate || usingNitro) state.speed += currentAccel * deltaTime;
    if (inputState.brake) state.speed -= BRAKE * deltaTime;
    if (!inputState.accelerate && !inputState.brake && !usingNitro) {
        state.speed -= DECEL * deltaTime;
    }

    const maxSpeed = usingNitro ? MAX_SPEED * 1.4 : MAX_SPEED;
    state.speed = Math.max(0, Math.min(maxSpeed, state.speed));
}