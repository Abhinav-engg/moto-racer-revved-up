import { state } from '../variables/state.js';
import { createRoad, addCurve, addHill, closeRoad } from './road.js';

function buildClassicTrack() {
    addCurve(0, 25, 0);
    addCurve(25, 45, 3500);
    addHill(25, 45, 250);

    addCurve(70, 25, -2500);
    addHill(70, 25, 200);

    addCurve(95, 25, 1500);
    addHill(95, 25, -30);

    addCurve(120, 30, -2050);

    addCurve(150, 35, -3500);
    addHill(150, 35, -260);

    addCurve(185, 35, 240);
    addHill(185, 35, 100);

    addCurve(220, 30, -3500);
    addHill(220, 30, -50);

    addCurve(250, 25, -1000);
    addHill(250, 25, 30);

    addCurve(275, 45, -300);
    addHill(275, 45, 20);

    addCurve(320, 45, 2500);
    addHill(320, 45, 400);

    addCurve(365, 35, 2550);
    addHill(365, 35, -200);

    addCurve(400, 35, 3500);
    addHill(400, 35, 40);

    addCurve(435, 30, -2300);

    addCurve(465, 20, -200);
    addHill(465, 20, -30);

    closeRoad();
}

function buildSnowyTrack() {
    addCurve(0, 30, 0);
    addHill(0, 30, 100);

    addCurve(30, 35, 4200);
    addHill(30, 35, 250);

    addCurve(65, 35, -4800);
    addHill(65, 35, -175);

    addCurve(100, 25, 2500);
    addHill(100, 25, 325);

    addCurve(125, 45, -3000);
    addHill(125, 45, -275);

    addCurve(170, 30, -5200);
    addHill(170, 30, 150);

    addCurve(200, 40, 4600);
    addHill(200, 40, 350);

    addCurve(240, 30, 1800);
    addHill(240, 30, -325);

    addCurve(270, 50, -4200);
    addHill(270, 50, 225);

    addCurve(320, 35, 5200);
    addHill(320, 35, -375);

    addCurve(355, 45, -3500);
    addHill(355, 45, 250);

    addCurve(400, 35, -5000);
    addHill(400, 35, -200);

    addCurve(435, 40, 3800);
    addHill(435, 40, 150);

    addCurve(475, 35, 2200);
    addHill(475, 35, -150);

    addCurve(510, 45, -4000);
    addHill(510, 45, 100);

    closeRoad();
}

export function buildTrack() {
    createRoad();

    if (state.track == 'snowy') {
        buildSnowyTrack();
        return;
    }

    buildClassicTrack();


}