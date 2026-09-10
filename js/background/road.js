import {state} from '../variables/state.js';

import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    ROAD_WIDTH,
    SEGMENT_LENGTH,
    ROAD_SEGMENTS,
    CAMERA_HEIGHT,
    CAMERA_DEPTH,
    DRAW_DISTANCE,
    STEER_SPEED
}from '../variables/variable.js';


export function createRoad() {

    state.road= [];

    for (let i = 0;i < ROAD_SEGMENTS;i++) {
        state.road.push({
            index:i,
            z:i * SEGMENT_LENGTH,
            y:0,
            x:0,
            curve:0
        });

    }

    state.tracklength = ROAD_SEGMENTS *SEGMENT_LENGTH;

    
       
}


export function projectSegment(segment) {

    let relativeZ = segment.z - state.cameraZ;

    if (relativeZ < 0) {
        relativeZ += state.tracklength;
    }

    if (relativeZ < SEGMENT_LENGTH * 0.5) {
        relativeZ = SEGMENT_LENGTH * 0.5;
    }

    const scale = CAMERA_DEPTH / relativeZ;

    const x =
        CANVAS_WIDTH / 2 +(segment.x - state.cameraX) *scale *CANVAS_WIDTH / 2;

    const y =
        CANVAS_HEIGHT / 2 +(CAMERA_HEIGHT - segment.y) *scale *CANVAS_HEIGHT / 2;

    const width =ROAD_WIDTH *scale *CANVAS_WIDTH / 2;

    return {
        x,
        y,
        width,
        scale
    };
}
export function drawRoad(ctx) {

    const baseIndex = Math.floor(state.cameraZ / SEGMENT_LENGTH);

    for (let i = DRAW_DISTANCE; i >= 0; i--) {

        const currentIndex = (baseIndex + i) % ROAD_SEGMENTS;
        const nextIndex =(baseIndex+i+1)%ROAD_SEGMENTS;

        const current =projectSegment(state.road[currentIndex]);
        const next = projectSegment(state.road[nextIndex]);

        if (!current||!next) {
            continue;
        }

        if (current.width < 20) {
            continue;
        }

        ctx.beginPath();
        ctx.moveTo(
            current.x - current.width / 2,
            current.y
        );
        ctx.lineTo(
            current.x + current.width / 2,
            current.y
        );
        ctx.lineTo(
            next.x + next.width / 2,
            next.y
        );
        ctx.lineTo(
            next.x - next.width / 2,
            next.y
        );
        ctx.closePath();
        ctx.fillStyle = 'gray';

        ctx.fill();
    }
}



export function updateRoad(deltaTime) {
    state.cameraZ += state.speed * deltaTime;
    if (state.tracklength > 0) {
        if (state.cameraZ >= state.tracklength) {
            state.lap++;
        }
        state.cameraZ %= state.tracklength;
        if (state.cameraZ < 0) {
            state.cameraZ += state.tracklength;
        }
    }

    state.cameraX = getRoadX(state.cameraZ);
}

export function drawRoadShoulders(ctx) {

    const baseIndex = Math.floor(state.cameraZ / SEGMENT_LENGTH);

    for (let i = DRAW_DISTANCE; i >= 0; i--) {

        const currentIndex = (baseIndex + i) % ROAD_SEGMENTS;
        const nextIndex = (baseIndex + i + 1) % ROAD_SEGMENTS;
        const current = projectSegment(state.road[currentIndex]);
        const next = projectSegment(state.road[nextIndex]);

        if (!current || !next) {
            continue;
        }

        if (current.width < 20) {
            continue;
        }

        const currentShoulderWidth = current.width * 1.15;
        const nextShoulderWidth = next.width * 1.15;

        ctx.beginPath();

        ctx.moveTo(
            current.x - currentShoulderWidth / 2,
            current.y
        );

        ctx.lineTo(
            current.x + currentShoulderWidth / 2,
            current.y
        );

        ctx.lineTo(
            next.x + nextShoulderWidth / 2,
            next.y + 1
        );

        ctx.lineTo(
            next.x - nextShoulderWidth / 2,
            next.y + 1
        );

        ctx.closePath();

        ctx.fillStyle = '#777';
        ctx.fill();
    }
}

export function getCurrentShoulder() {
    if (!state.road || state.road.length === 0) return null;
    const baseIndex = Math.floor(state.cameraZ / SEGMENT_LENGTH);
    let target = null;
    for (let i = 1; i <= DRAW_DISTANCE; i++) {
        const segIndex = (baseIndex + i) % ROAD_SEGMENTS;
        const projected = projectSegment(state.road[segIndex]);
        if (projected && projected.y <= CANVAS_HEIGHT) {
            target = projected;
            if (projected.y <= CANVAS_HEIGHT - 60) {
                break;
            }
        }
    }

    if (!target) return null;

    const currentShoulderWidth = target.width * 1.15;
    return {
        x: target.x,
        y: target.y,
        width: currentShoulderWidth,
        leftX: target.x - currentShoulderWidth / 2,
        rightX: target.x + currentShoulderWidth / 2
    };
}


export function drawLaneMarkings(ctx) {

    const baseIndex = Math.floor(state.cameraZ / SEGMENT_LENGTH);

    for (let i = DRAW_DISTANCE; i >= 0; i--) {

        const currentIndex = (baseIndex + i) % ROAD_SEGMENTS;
        const nextIndex = (baseIndex + i + 1) % ROAD_SEGMENTS;
        const current = projectSegment(state.road[currentIndex]);
        const next = projectSegment(state.road[nextIndex]);

        if (!current || !next) {
            continue;
        }

        if (current.width < 20) {
            continue;
        }

        const currentLaneWidth = current.width / 3;
        const nextLaneWidth = next.width / 3;
        const currentLineWidth = Math.max(1, current.width * 0.01);
        const nextLineWidth = Math.max(1, next.width * 0.01);
        if (currentIndex % 6 > 2) {continue;}
        ctx.beginPath();

        ctx.moveTo(
            current.x - current.width / 2 + currentLaneWidth,
            current.y
        );
        ctx.lineTo(
            next.x - next.width / 2 + nextLaneWidth,
            next.y
        );
        ctx.lineWidth = currentLineWidth;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.beginPath();

        ctx.moveTo(
            current.x - current.width / 2 + currentLaneWidth * 2,
            current.y
        );

        ctx.lineTo(
            next.x - next.width / 2 + nextLaneWidth * 2,
            next.y
        );

        ctx.lineWidth = currentLineWidth;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }
}

export function addCurve(start,length,curve){
    for (let i = 0; i < length; i++) {

        const segment = state.road[start + i];

        if (!segment) {
            break;
        }

        const progress = i / (length - 1);

        segment.x += curve * (1 - Math.cos(progress * Math.PI)) / 2;


    }
    for (let i = start + length; i < state.road.length; i++) {
        state.road[i].x += curve;
    }

}

export function getRoadX(z) {
    if (state.road.length == 0) {
        return 0;
    }

    const segmentPosition = z / SEGMENT_LENGTH;
    const index = Math.floor(segmentPosition) % ROAD_SEGMENTS;
    const nextIndex = (index + 1) % ROAD_SEGMENTS;
    const segment = state.road[index];
    const nextSegment = state.road[nextIndex];

    if (!segment || !nextSegment) {
        return 0;
    }

    const progress = segmentPosition - Math.floor(segmentPosition);
    return segment.x + (nextSegment.x - segment.x) * progress;
}

export function closeRoad() {
    if (state.road.length < 2) {
        return;
    }

    const endOffset = state.road[state.road.length - 1].x;
    const lastIndex = state.road.length - 1;

    for (let i = 0; i < state.road.length; i++) {
        state.road[i].x -= endOffset * (i / lastIndex);
    }
}



export function addHill(start, length, height) {

    for (let i = 0; i < length; i++) {

        const segment = state.road[start + i];

        if (!segment) {
            break;
        }

        const progress = i / (length - 1);

        segment.y += height * Math.sin(progress * Math.PI);
    }
}