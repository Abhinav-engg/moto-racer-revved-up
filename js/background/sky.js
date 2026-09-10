import { state } from '../variables/state.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../variables/variable.js';

const starsImg = new Image();
starsImg.src = 'assets/scenery/2.png';

const auroraImg = new Image();
auroraImg.src = 'assets/scenery/1.png';

const mountainsImg = new Image();
mountainsImg.src = 'assets/scenery/3.png';

const STARS_PARALLAX = 0.002;
const AURORA_PARALLAX = 0.008;
const MOUNTAINS_PARALLAX = 0.01; 

const HORIZON_Y = CANVAS_HEIGHT /2;

function drawTiledLayer(ctx, img, parallax, bottomY, height) {

    if (!img.complete || img.naturalWidth == 0) {
        return;
    }

    const scale = height / img.naturalHeight;
    const w = Math.ceil(img.naturalWidth * scale) + 1;
    const topY = bottomY - height;

    const offset = ((state.cameraX * parallax) % w + w) % w;

    let x = -offset;
    let tileIndex = Math.floor((-offset) / w);

    while (x < CANVAS_WIDTH) {

        ctx.save();

        if (tileIndex % 2 !== 0) {
            ctx.translate(x + w, topY);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, w, height);
        } else {
            ctx.drawImage(img, x, topY, w, height);
        }

        ctx.restore();

        x += w;
        tileIndex++;
    }
}

export function drawSky(ctx) {

    ctx.fillStyle = '#0a1a2f';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawTiledLayer(ctx, starsImg, STARS_PARALLAX, HORIZON_Y, HORIZON_Y);
    drawTiledLayer(ctx, auroraImg, AURORA_PARALLAX, HORIZON_Y, HORIZON_Y);
    drawTiledLayer(ctx, mountainsImg, MOUNTAINS_PARALLAX, HORIZON_Y, HORIZON_Y * 0.7);
}