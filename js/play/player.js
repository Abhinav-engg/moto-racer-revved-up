import { state } from '../variables/state.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, STEER_SPEED } from '../variables/variable.js';
import { inputState } from '../inputs/inputs.js';

const bikeSprite = new Image();
bikeSprite.src = 'assets/sprites/bike-black.png';

const MAX_TILT = 0.25;
const TILT_SPEED = 6;

let tiltAngle = 0;

export function updatePlayer(deltaTime) {
  let targetTilt = 0;

  if (inputState.left) {
    state.playerX -= STEER_SPEED * deltaTime;
    targetTilt = -MAX_TILT;
  }
  if (inputState.right) {
    state.playerX += STEER_SPEED * deltaTime;
    targetTilt = MAX_TILT;
  }

  state.playerX = Math.max(-1, Math.min(1, state.playerX));

  if (tiltAngle < targetTilt) {
    tiltAngle = Math.min(targetTilt, tiltAngle + TILT_SPEED * deltaTime);
  } else if (tiltAngle > targetTilt) {
    tiltAngle = Math.max(targetTilt, tiltAngle - TILT_SPEED * deltaTime);
  }
}

export function drawPlayer(ctx) {
  if (!bikeSprite.complete || bikeSprite.naturalWidth === 0) {
    return;
  }

  const drawWidth = 70;
  const drawHeight = 150;

  const playerScreenX = CANVAS_WIDTH / 2 + (state.playerX || 0) * (CANVAS_WIDTH / 2);
  const x = Math.max(0, Math.min(CANVAS_WIDTH - drawWidth, playerScreenX - drawWidth / 2));
  const y = CANVAS_HEIGHT - drawHeight - 10;

  const centerX = x + drawWidth / 2;
  const centerY = y + drawHeight / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(tiltAngle);
  ctx.drawImage(bikeSprite, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();
}
