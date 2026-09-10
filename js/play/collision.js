import { state } from '../variables/state.js';
import { CANVAS_WIDTH } from '../variables/variable.js';
import { getCurrentShoulder } from '../background/road.js';

let cooldown = 0;

export function checkCollision(deltaTime) {
    if (cooldown > 0){
        cooldown -= deltaTime;
    }
         

    const shoulder = getCurrentShoulder();
    if (!shoulder) return;

    const bikeX = CANVAS_WIDTH / 2 + state.playerX * (CANVAS_WIDTH / 2);
    const halfWidth = 75;

    const isOffRoad = (bikeX - halfWidth) < shoulder.leftX || (bikeX + halfWidth) > shoulder.rightX;

    if (isOffRoad && cooldown <= 0 && state.lives > 0) {
        state.lives--;
        cooldown = 1.5;
    }
}
