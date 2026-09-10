export function calculateScore(coins, lives) {
    return coins + (3 - lives) * 100;
}

export function isRaceComplete(lap) {
    return lap >= 3;
}
