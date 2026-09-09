import { state } from '../variables/state.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, STEER_SPEED } from '../variables/variable.js';
import { inputState } from '../inputs/inputs.js';

const bikeSprite = new Image();
bikeSprite.src = 'assets/sprites/bike.png';

const spriteCols = 7;
const CENTER_FRAME = Math.floor(spriteCols / 2);
const MIN_FRAME = 0;
const MAX_FRAME = spriteCols - 1;
const FRAME_ANIMATION_SPEED = 12;

let currentFrame = CENTER_FRAME;

export function updatePlayer(deltaTime) {
  let targetFrame = CENTER_FRAME;

  if (inputState.left) {
    state.playerX -= (STEER_SPEED || 2.5) * deltaTime;
    targetFrame = MIN_FRAME;
  }
  if (inputState.right) {
    state.playerX += (STEER_SPEED || 2.5) * deltaTime;
    targetFrame = MAX_FRAME;
  }

  const maxPlayerX = 1.2;
  state.playerX = Math.max(-maxPlayerX, Math.min(maxPlayerX, state.playerX));

  if (currentFrame < targetFrame) {
    currentFrame = Math.min(targetFrame, currentFrame + FRAME_ANIMATION_SPEED * deltaTime);
  } else if (currentFrame > targetFrame) {
    currentFrame = Math.max(targetFrame, currentFrame - FRAME_ANIMATION_SPEED * deltaTime);
  }
}

export function drawPlayer(ctx) {
  const realWidth = bikeSprite.naturalWidth;
  const realHeight = bikeSprite.naturalHeight;

  if (!bikeSprite.complete || realWidth === 0) {
    return;
  }

  const sourceWidth = realWidth / spriteCols;
  const sourceHeight = realHeight;
  const frameIndex = Math.max(0, Math.min(spriteCols - 1, Math.round(currentFrame)));

  const sourceX = frameIndex * sourceWidth;
  const sourceY = 0;

  const drawWidth = 150;
  const drawHeight = 150;

  const playerScreenX = CANVAS_WIDTH / 2 + (state.playerX || 0) * (CANVAS_WIDTH / 2);
  const x = Math.max(0, Math.min(CANVAS_WIDTH - drawWidth, playerScreenX - drawWidth / 2));
  const y = CANVAS_HEIGHT - drawHeight - 10;

  ctx.drawImage(
    bikeSprite,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    drawWidth,
    drawHeight
  );
}
