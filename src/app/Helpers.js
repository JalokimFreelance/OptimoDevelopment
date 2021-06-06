//return a random int between min and max (including min and max)
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
