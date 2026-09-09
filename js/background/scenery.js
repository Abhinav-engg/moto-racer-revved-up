import { state } from '../variables/state.js';
import { projectSegment } from './road.js';

const scenery = [];

export function addScenery(segmentIndex, side, offset, image, width, height) {

    scenery.push({
        segmentIndex,
        side,
        offset,
        image,
        width,
        height
    });
}

export function drawScenery(ctx) {

    for (const object of scenery) {

        const segment = state.road[object.segmentIndex];

        if (!segment) {
            continue;
        }

        const projected = projectSegment(segment);

        if (!projected) {
            continue;
        }

        const x = projected.x
            + object.side * (projected.width / 2 + object.offset * projected.scale);

        const y = projected.y;

        const width = object.width * projected.scale;
        const height = object.height * projected.scale;

        ctx.drawImage(
            object.image,
            x - width / 2,
            y - height,
            width,
            height
        );
    }
}

function sideOffset(object, projected) {

    return object.side * (
        projected.width / 2 +
        object.offset * projected.scale
    );
}

export function buildScenery() {
    if (typeof treeImg === 'undefined' || typeof palmImg === 'undefined' || typeof rockImg === 'undefined') {
        return;
    }

    addScenery(20, -1, 500, treeImg, 200, 300);
addScenery(35, 1, 600, treeImg, 200, 300);

addScenery(60, -1, 450, palmImg, 180, 320);
addScenery(80, 1, 500, rockImg, 180, 200);

addScenery(110, -1, 550, treeImg, 200, 300);
addScenery(130, 1, 500, treeImg, 200, 300);

addScenery(160, -1, 600, rockImg, 180, 200);
addScenery(180, 1, 500, palmImg, 180, 320);

addScenery(220, -1, 550, treeImg, 200, 300);
addScenery(240, 1, 600, treeImg, 200, 300);

addScenery(280, -1, 500, rockImg, 180, 200);
addScenery(300, 1, 550, treeImg, 200, 300);

addScenery(340, -1, 600, palmImg, 180, 320);
addScenery(360, 1, 500, treeImg, 200, 300);

addScenery(400, -1, 550, rockImg, 180, 200);
addScenery(430, 1, 600, treeImg, 200, 300);

addScenery(460, -1, 500, palmImg, 180, 320);
addScenery(480, 1, 550, treeImg, 200, 300);
}