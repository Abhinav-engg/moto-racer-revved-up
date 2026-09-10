import { state } from '../variables/state.js';
import { projectSegment, getRoadX } from './road.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SEGMENT_LENGTH, DRAW_DISTANCE } from '../variables/variable.js';

const scenery = [];

const treeImg = new Image();
treeImg.src = 'assets/scenery/tree.png';

const FOREST_LENGTH = 100000;

const MIN_GAP = 250;
const MAX_GAP = 3000;

const MIN_SPACING = 150;
const MAX_SPACING = 300;


function random(min, max) {
    return Math.random() * (max - min) + min;
}


function addTree(z, side) {

    scenery.push({
        z: z,
        side: side,

        offset: random(MIN_GAP, MAX_GAP),

        image: treeImg,

        width: random(600, 1100),
        height: random(1000, 1800)
    });
}


export function buildForest() {

    scenery.length = 0;

    let z = 200;

    while (z < FOREST_LENGTH) {

        addTree(z, -1);
        addTree(z + random(20, 100), -1);

        if (Math.random() < 0.9) {
            addTree(z, 1);
        }
        if (Math.random() < 0.9) {
            addTree(z + random(20, 100), 1);
        }

        z += random(MIN_SPACING, MAX_SPACING);
    }
}


export function drawScenery(ctx) {

    if (!treeImg.complete) {
        return;
    }

    const visible = [];

    for (const tree of scenery) {

        let relativeZ = tree.z - state.cameraZ;

        if (relativeZ < 0) {
            relativeZ += state.tracklength;
        }

        if (relativeZ <= 0) {
            continue;
        }

        if (relativeZ > DRAW_DISTANCE * SEGMENT_LENGTH) {
            continue;
        }

        visible.push({ tree, relativeZ });
    }

    visible.sort((a, b) => b.relativeZ - a.relativeZ);

    for (const { tree } of visible) {

        const roadX = getRoadX(tree.z);

        const pseudoSegment = {
            z: tree.z,
            x: roadX,
            y: 0
        };

        const projected = projectSegment(pseudoSegment);

        if (!projected) {
            continue;
        }

        const x =
            projected.x +
            tree.side *
            (
                projected.width / 2 +
                tree.offset * projected.scale * (CANVAS_WIDTH / 2)
            );

        const y = projected.y;

        const width = tree.width * projected.scale * (CANVAS_WIDTH / 2);
const height = tree.height * projected.scale * (CANVAS_HEIGHT / 2);

if (width < 20 || height < 20) {
    continue;
}

ctx.drawImage(
    tree.image,
    x - width / 2,
    y - height,
    width,
    height
);
    }
}