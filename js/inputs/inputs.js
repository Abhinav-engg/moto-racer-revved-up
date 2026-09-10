export const inputState = {
    accelerate: false,
    brake: false,
    left: false,
    right: false,
    nitro: false,
    wheelie: false
};

export function setupInputs(){
    window.addEventListener('keydown', function(event){
        const key = event.key.toLowerCase();
        if(key === 'arrowup' || key === 'w'){
            inputState.accelerate = true;
        }

        if(key === 'arrowdown' || key === 's'){
            inputState.brake = true;
        }

        if(key === 'arrowleft' || key === 'a'){
            inputState.left = true;
        }

        if(key === 'arrowright' || key === 'd'){
            inputState.right = true;
        }

        if(key === ' ' || key === 'spacebar' || event.code === 'Space'){
            event.preventDefault();
            inputState.nitro = true;
        }

        if(key === 'w' && event.shiftKey){
            inputState.wheelie = true;
        }
    });

    window.addEventListener('keyup', function(event){
        const key = event.key.toLowerCase();
        if(key === 'arrowup' || key === 'w'){
            inputState.accelerate = false;
        }

        if(key === 'arrowdown' || key === 's'){
            inputState.brake = false;
        }

        if(key === 'arrowleft' || key === 'a'){
            inputState.left = false;
        }

        if(key === 'arrowright' || key === 'd'){
            inputState.right = false;
        }

        if(key === ' ' || key === 'spacebar' || event.code === 'Space'){
            inputState.nitro = false;
        }

        if(key === 'w' && event.shiftKey){
            inputState.wheelie = false;
        }
    });
}
