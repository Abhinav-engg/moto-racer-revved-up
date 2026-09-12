import { state } from '../variables/state.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SEGMENT_LENGTH, DRAW_DISTANCE } from '../variables/variable.js';
import { getCurrentShoulder, projectSegment, getRoadX } from '../background/road.js';
import { triggerScreenShake } from '../game/update.js';
let cooldown = 0;
const coins = [];
const nitros = [];

const coinImg = new Image();
coinImg.src = 'assets/elements/coin.gif';

const nitroImg = new Image();
nitroImg.src = 'assets/elements/nitro.webp';

export function drawCoins(ctx) {
    if (coins.length === 0 && state.tracklength > 0) {
        for (let z = 600; z < state.tracklength; z += 800) {
            coins.push({
                z: z,
                xOffset: Math.random() * 1.6 - 0.8,
                collected: false
            });
        }
    }

    if (nitros.length === 0 && state.tracklength > 0) {
        for (let z = 2400; z < state.tracklength; z += 4000) {
            nitros.push({
                z: z,
                xOffset: Math.random() * 1.4 - 0.7,
                collected: false
            });
        }
    }

    const maxDistance = DRAW_DISTANCE * SEGMENT_LENGTH;

    if (coinImg.complete) {
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

    if (nitroImg.complete) {
        for (let i = nitros.length - 1; i >= 0; i--) {
            const nitro = nitros[i];
            if (nitro.collected) continue;

            let relativeZ = nitro.z - state.cameraZ;
            if (relativeZ < 0) relativeZ += state.tracklength;
            if (relativeZ <= 0 || relativeZ > maxDistance) continue;

            const roadX = getRoadX(nitro.z);
            const projected = projectSegment({ z: nitro.z, x: roadX, y: 0 });
            if (!projected) continue;

            const screenX = projected.x + nitro.xOffset * (projected.width / 2);
            const screenY = projected.y;
            const size = 200 * projected.scale * (CANVAS_WIDTH / 2);

            if (size >= 6) {
                ctx.drawImage(nitroImg, screenX - size / 2, screenY - size, size, size);
            }
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
            triggerScreenShake();
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

    for (let i = 0; i < nitros.length; i++) {
        const nitro = nitros[i];
        if (nitro.collected) continue;

        let relativeZ = nitro.z - state.cameraZ;
        if (relativeZ < 0) relativeZ += state.tracklength;
        if (relativeZ > 1500 || relativeZ <= 0) continue;

        const roadX = getRoadX(nitro.z);
        const projected = projectSegment({ z: nitro.z, x: roadX, y: 0 });
        if (!projected) continue;

        const screenX = projected.x + nitro.xOffset * (projected.width / 2);
        const screenY = projected.y;
        const size = 200 * projected.scale * (CANVAS_WIDTH / 2);

        const nitroLeft = screenX - size / 2;
        const nitroRight = screenX + size / 2;
        const nitroTop = screenY - size;
        const nitroBottom = screenY;

        if (bikeRight > nitroLeft && bikeLeft < nitroRight && bikeBottom > nitroTop && bikeTop < nitroBottom) {
            nitro.collected = true;
            state.nitro = 100;
        }
    }
}
