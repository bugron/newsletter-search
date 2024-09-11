export function randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise((resolve) => setTimeout(resolve, delay * 1000));
}
