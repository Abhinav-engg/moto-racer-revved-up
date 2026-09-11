import { drawGrass } from '../background/grass.js';
import { drawRoad, drawRoadShoulders, drawLaneMarkings } from '../background/road.js';
import { drawScenery } from '../background/scenery.js';
import { drawSky } from '../background/sky.js';
import { drawPlayer } from '../play/player.js';
import { drawCoins } from '../play/collision.js';
import { drawOpponents } from '../play/opponent.js';

export function drawGame(ctx) {
	drawSky(ctx);
	drawGrass(ctx);
	drawScenery(ctx);
	drawRoadShoulders(ctx);
	drawRoad(ctx);
	drawLaneMarkings(ctx);
	drawCoins(ctx);
	drawOpponents(ctx);
	drawPlayer(ctx);
}
