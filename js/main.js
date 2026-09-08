const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function update() {

}

function draw() {
    
    
    



}

function gameLoop() {
    update();
    draw();


    requestAnimationFrame(gameLoop);
}

gameLoop();