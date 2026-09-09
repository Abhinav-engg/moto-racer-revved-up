import { createRoad, addCurve, addHill } from './road.js';

export function buildTrack() {
    createRoad();

    addCurve(0, 25, 0);
    addCurve(25, 45, 6500);
    addHill(25, 45, 300);

    addCurve(70, 25, -5000);
    addHill(70, 25, 500);

    addCurve(95, 25, 3000);
    addHill(95, 25, -300);

    addCurve(120, 30, -4500);


    // Sector 2
    // 150 - 320

    addCurve(150, 35, -6000);
    addHill(150, 35, -700);

    addCurve(185, 35, 700);
    addHill(185, 35, 100);

    addCurve(220, 30, -800);
    addHill(220, 30, -50);

    addCurve(250, 25, 400);
    addHill(250, 25, 30);

    addCurve(275, 45, 300);
    addHill(275, 45, 20);


    // Sector 3
    // 320 - 500

    addCurve(320, 45, 5000);
    addHill(320, 45, 400);

    addCurve(365, 35, -6500);
    addHill(365, 35, -600);

    addCurve(400, 35, 5000);
    addHill(400, 35, 400);

    addCurve(435, 30, -3000);
    addHill(435, 30, -300);

    addCurve(465, 20, -6000);
    addHill(465, 20, -300);

    

    



}