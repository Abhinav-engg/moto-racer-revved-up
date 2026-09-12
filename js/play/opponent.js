import { state } from '../variables/state.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SEGMENT_LENGTH, DRAW_DISTANCE, ACCEL } from '../variables/variable.js';
import { projectSegment, getRoadX } from '../background/road.js';

const spriteSources = [
    'assets/sprites/1.png',
    'assets/sprites/2.png',
    'assets/sprites/3.png',
    'assets/sprites/4.png',
    'assets/sprites/5.png'
];

const opponentSprites = spriteSources.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
});

const opponents = [];
let cooldown = 0;

export function initOpponents() {
    opponents.length = 0;
    cooldown = 0;

    if (!state.tracklength || state.tracklength === 0) return;

    if (state.mode === 'timed') {
        opponents.push({
            z: 300,
            xOffset: -0.35,
            targetX: -0.35,
            speed: 0,
            topSpeed: 6800,
            steerSpeed: 0.6,
            changeTimer: 2.5,
            spriteIndex: 0
        });
        opponents.push({
            z: 600,
            xOffset: 0.35,
            targetX: 0.35,
            speed: 0,
            topSpeed: 7100,
            steerSpeed: 0.6,
            changeTimer: 3.5,
            spriteIndex: 1
        });
    } else {
        for (let z = 4000; z < state.tracklength; z += 8000) {
            opponents.push({
                z: z,
                xOffset: Math.random() * 1.2 - 0.6,
                targetX: Math.random() * 1.2 - 0.6,
                speed: 1500 + Math.random() * 1500,
                steerSpeed: 0.4 + Math.random() * 0.5,
                changeTimer: Math.random() * 3 + 1,
                spriteIndex: Math.floor(Math.random() * opponentSprites.length)
            });
        }
    }
}

export function updateOpponents(deltaTime) {
    if (opponents.length === 0 && state.tracklength > 0) {
        initOpponents();
    }

    if (cooldown > 0) {
        cooldown -= deltaTime;
    }

    for (let i = 0; i < opponents.length; i++) {
        const opp = opponents[i];

        if (state.mode === 'timed') {
            updateRaceRival(opp, deltaTime);
        } else {
            updateTraffic(opp, deltaTime);
        }

        opp.z = (opp.z + opp.speed * deltaTime) % state.tracklength;

        const diff = opp.targetX - opp.xOffset;
        if (Math.abs(diff) > 0.02) {
            const step = Math.sign(diff) * opp.steerSpeed * deltaTime;
            opp.xOffset += Math.min(Math.abs(diff), Math.abs(step)) * Math.sign(diff);
        }

        opp.xOffset = Math.max(-0.7, Math.min(0.7, opp.xOffset));
    }
}

function updateRaceRival(opp, deltaTime) {
    if (state.speed > 0 && opp.speed < opp.topSpeed) {
        opp.speed = Math.min(opp.topSpeed, opp.speed + ACCEL * 0.9 * deltaTime);
    }

    opp.changeTimer -= deltaTime;
    if (opp.changeTimer <= 0) {
        opp.targetX = Math.random() * 0.8 - 0.4;
        opp.changeTimer = Math.random() * 3.0 + 2.0;
    }
}

function updateTraffic(opp, deltaTime) {
    opp.changeTimer -= deltaTime;
    if (opp.changeTimer <= 0) {
        opp.targetX = Math.random() * 1.2 - 0.6;
        opp.changeTimer = Math.random() * 3 + 2;
        opp.speed = 1500 + Math.random() * 1500;
    }
}

export function drawOpponents(ctx) {
    const maxDistance = DRAW_DISTANCE * SEGMENT_LENGTH;

    const visibleOpponents = [];
    for (let i = 0; i < opponents.length; i++) {
        const opp = opponents[i];
        let relativeZ = opp.z - state.cameraZ;
        if (relativeZ < 0) {
            relativeZ += state.tracklength;
        }
        if (relativeZ > 0 && relativeZ <= maxDistance) {
            visibleOpponents.push({ opp, relativeZ });
        }
    }

    visibleOpponents.sort((a, b) => b.relativeZ - a.relativeZ);

    for (let i = 0; i < visibleOpponents.length; i++) {
        const { opp } = visibleOpponents[i];
        const sprite = opponentSprites[opp.spriteIndex % opponentSprites.length];
        if (!sprite.complete || sprite.naturalWidth === 0) {
            continue;
        }

        const roadX = getRoadX(opp.z);
        const projected = projectSegment({ z: opp.z, x: roadX, y: 0 });
        if (!projected) {
            continue;
        }

        const screenX = projected.x + opp.xOffset * (projected.width / 2);
        const screenY = projected.y;
        const height = 380 * projected.scale * (CANVAS_WIDTH / 2);
        const aspectRatio = sprite.naturalWidth / sprite.naturalHeight;
        const width = height * aspectRatio;

        if (height >= 8) {
            ctx.drawImage(
                sprite,
                0,
                0,
                sprite.naturalWidth,
                sprite.naturalHeight,
                screenX - width / 2,
                screenY - height,
                width,
                height
            );
        }
    }
}

export function checkOpponentsCollision() {
    if (state.mode === 'timed') {
        return;
    }

    const bikeScreenX = CANVAS_WIDTH / 2 + state.playerX * (CANVAS_WIDTH / 2);
    const bikeLeft = bikeScreenX - 60;
    const bikeRight = bikeScreenX + 60;
    const bikeTop = CANVAS_HEIGHT - 150;
    const bikeBottom = CANVAS_HEIGHT - 10;

    for (let i = 0; i < opponents.length; i++) {
        const opp = opponents[i];
        let relativeZ = opp.z - state.cameraZ;
        if (relativeZ < 0) {
            relativeZ += state.tracklength;
        }
        if (relativeZ > 1200 || relativeZ <= 0) {
            continue;
        }

        const roadX = getRoadX(opp.z);
        const projected = projectSegment({ z: opp.z, x: roadX, y: 0 });
        if (!projected) {
            continue;
        }

        const sprite = opponentSprites[opp.spriteIndex % opponentSprites.length];
        const screenX = projected.x + opp.xOffset * (projected.width / 2);
        const screenY = projected.y;
        const height = 380 * projected.scale * (CANVAS_WIDTH / 2);
        const aspectRatio = (sprite.complete && sprite.naturalHeight > 0) ? (sprite.naturalWidth / sprite.naturalHeight) : 1;
        const width = height * aspectRatio;

        const oppLeft = screenX - width / 3;
        const oppRight = screenX + width / 3;
        const oppBottom = screenY;

        if (bikeRight > oppLeft && bikeLeft < oppRight && bikeTop < oppBottom && bikeBottom > screenY - height) {
            if (cooldown <= 0 && state.lives > 0) {
                state.speed = Math.max(0, state.speed * 0.5);
                cooldown = 1.5;
            }
        }
    }
}
