

import { state } from '../variables/state.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../variables/variable.js';

const bikeSprite = new Image();
bikeSprite.src = 'assets/sprites/bike.png';

const spriteCols = 7;

export function drawPlayer(ctx) {
  const realWidth = bikeSprite.naturalWidth;
  const realHeight = bikeSprite.naturalHeight;

  if (!bikeSprite.complete || realWidth === 0) {
    return;
  }

  const sourceWidth = realWidth / spriteCols;
  const sourceHeight = realHeight;
  const frameIndex = Math.floor(spriteCols / 2);

  const sourceX = frameIndex * sourceWidth;
  const sourceY = 0;

  const drawWidth = 150;
  const drawHeight = 150;

  const playerScreenX = CANVAS_WIDTH / 2 + (state.playerX || 0) * (CANVAS_WIDTH / 2);
  const x = playerScreenX - drawWidth / 2;
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

 