import {state} from '../variables/state.js';
import {projectSegment} from './road.js';
import { CANVAS_WIDTH, SEGMENT_LENGTH, ROAD_SEGMENTS, DRAW_DISTANCE } from '../variables/variable.js';


export function drawGrass(ctx){

    const baseIndex = Math.floor(state.cameraZ / SEGMENT_LENGTH);

    for (let i = DRAW_DISTANCE; i >= 0; i--) {

        const currentIndex = (baseIndex + i) % ROAD_SEGMENTS;
        const nextIndex = (baseIndex + i + 1) % ROAD_SEGMENTS;

        if (nextIndex < currentIndex) {
            continue;
        }

        const current = projectSegment(state.road[currentIndex]);
        const next = projectSegment(state.road[nextIndex]);

        if (!current || !next) {
            continue;
        }

        if (current.width < 20) {
            continue;
        }

        const currentLeft = current.x - current.width / 2;
        const currentRight = current.x + current.width / 2;

        const nextLeft = next.x - next.width / 2;
        const nextRight = next.x + next.width / 2;

        ctx.beginPath();
        ctx.moveTo(0, current.y);
        ctx.lineTo(currentLeft, current.y);
        ctx.lineTo(nextLeft, next.y);
        ctx.lineTo(0, next.y);
        ctx.closePath();
        ctx.fillStyle = 'green';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(currentRight, current.y);
        ctx.lineTo(CANVAS_WIDTH, current.y);
        ctx.lineTo(CANVAS_WIDTH, next.y);
        ctx.lineTo(nextRight, next.y);
        ctx.closePath();
        ctx.fillStyle = 'green';
        ctx.fill();
    }
}