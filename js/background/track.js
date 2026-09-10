import { createRoad, addCurve, addHill, closeRoad } from './road.js';

export function buildTrack() {
    createRoad();

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