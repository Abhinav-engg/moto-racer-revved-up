import { state } from '../variables/state.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SEGMENT_LENGTH, DRAW_DISTANCE } from '../variables/variable.js';
import { getCurrentShoulder, projectSegment, getRoadX } from '../background/road.js';

let cooldown = 0;
const coins = [];

const coinImg = new Image();
coinImg.src = 'assets/elements/coin.gif';

export function drawCoins(ctx) {
    if (!coinImg.complete) return;

    if (coins.length === 0 && state.tracklength > 0) {
        for (let z = 600; z < state.tracklength; z += 800) {
            coins.push({
                z: z,
                xOffset: Math.random() * 1.6 - 0.8,
                collected: false
            });
        }
    }

    const maxDistance = DRAW_DISTANCE * SEGMENT_LENGTH;
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        if (coin.collected) continue;

        let relativeZ = coin.z - state.cameraZ;
        if (relativeZ < 0) relativeZ += state.tracklength;
        if (relativeZ <= 0 || relativeZ > maxDistance) continue;

        const roadX = getRoadX(coin.z);
        const projected = projectSegment({ z: coin.z, x: roadX, y: 0 });
        if (!projected) continue;

        const screenX = projected.x + coin.xOffset * (projected.width / 2);
        const screenY = projected.y;
        const size = 200 * projected.scale * (CANVAS_WIDTH / 2);

        if (size >= 6) {
            ctx.drawImage(coinImg, screenX - size / 2, screenY - size, size, size);
        }
    }
}

export function checkCollision(deltaTime) {
    if (cooldown > 0) {
        cooldown -= deltaTime;
    }

    const shoulder = getCurrentShoulder();
    if (shoulder) {
        const bikeX = CANVAS_WIDTH / 2 + state.playerX * (CANVAS_WIDTH / 2);
        const halfWidth = 75;

        const isOffRoad = (bikeX - halfWidth) < shoulder.leftX || (bikeX + halfWidth) > shoulder.rightX;

        if (isOffRoad && cooldown <= 0 && state.lives > 0) {
            state.lives--;
            cooldown = 1.5;
        }
    }

    const bikeScreenX = CANVAS_WIDTH / 2 + state.playerX * (CANVAS_WIDTH / 2);
    const bikeLeft = bikeScreenX - 75;
    const bikeRight = bikeScreenX + 75;
    const bikeTop = CANVAS_HEIGHT - 160;
    const bikeBottom = CANVAS_HEIGHT - 10;

    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        if (coin.collected) continue;

        let relativeZ = coin.z - state.cameraZ;
        if (relativeZ < 0) relativeZ += state.tracklength;
        if (relativeZ > 1500 || relativeZ <= 0) continue;

        const roadX = getRoadX(coin.z);
        const projected = projectSegment({ z: coin.z, x: roadX, y: 0 });
        if (!projected) continue;

        const screenX = projected.x + coin.xOffset * (projected.width / 2);
        const screenY = projected.y;
        const size = 200 * projected.scale * (CANVAS_WIDTH / 2);

        const coinLeft = screenX - size / 2;
        const coinRight = screenX + size / 2;
        const coinTop = screenY - size;
        const coinBottom = screenY;

        if (bikeRight > coinLeft && bikeLeft < coinRight && bikeBottom > coinTop && bikeTop < coinBottom) {
            coin.collected = true;
            state.coins++;
        }
    }
}
