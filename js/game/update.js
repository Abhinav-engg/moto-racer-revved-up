import { state } from '../variables/state.js';
import { updateRoad } from '../background/road.js';
import { updatePlayer } from '../play/player.js';
import { checkCollision } from '../play/collision.js';
import { updateOpponents, checkOpponentsCollision } from '../play/opponent.js';
import { updateSpeed } from './speed.js';
import { updateHud } from './hud.js';
import { checkGameEnd } from './gameOver.js';

export function updateGame(deltaTime) {
	if (state.gameOver) return;

	updateSpeed(deltaTime);
	updateRoad(deltaTime);
	updatePlayer(deltaTime);
	updateOpponents(deltaTime);
	checkCollision(deltaTime);
	checkOpponentsCollision();
	updateHud(deltaTime);
	checkGameEnd();
}
