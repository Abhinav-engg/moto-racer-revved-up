import {state} from '../variables/state.js';

import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    ROAD_WIDTH,
    SEGMENT_LENGTH,
    ROAD_SEGMENTS,
    CAMERA_HEIGHT,
    CAMERA_DEPTH
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

    const relativeZ = segment.z - state.cameraZ;

    if (relativeZ <= 0) {
        return null;
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

    for (let i = state.road.length-2; i>=0; i--) {

        const current = projectSegment(state.road[i]);
        const next = projectSegment(state.road[i+1]);

        if (!current || !next) {
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
        ctx.fillStyle = i % 2 === 0
            ? 'lightgray'
            : 'darkgray';

        ctx.fill();
    }
}