import { drawGrass } from '../background/grass.js';
import { drawRoad, drawRoadShoulders, drawLaneMarkings } from '../background/road.js';
import { drawScenery } from '../background/scenery.js';
import { drawSky } from '../background/sky.js';
import { drawPlayer } from '../play/player.js';
import { drawCoins } from '../play/collision.js';
import { drawOpponents } from '../play/opponent.js';
import { state } from '../variables/state.js';

export function drawGame(ctx) {

	if (state.shakeTime > 0) {
    const strength =
        state.shakeIntensity * (state.shakeTime / 0.3);

    const shakeX = (Math.random() * 2 - 1) * strength;
    const shakeY = (Math.random() * 2 - 1) * strength;

    ctx.save();
    ctx.translate(shakeX, shakeY);	
}


	drawSky(ctx);
	drawGrass(ctx);
	drawScenery(ctx);
	drawRoadShoulders(ctx);
	drawRoad(ctx);
	drawLaneMarkings(ctx);
	drawCoins(ctx);
	drawOpponents(ctx);
	drawPlayer(ctx);

	if (state.shakeTime > 0) {
        ctx.restore();
    }
}
