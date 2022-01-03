// these are just background objects that move slowly down the screen
// this is purely a visual effect

class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = Math.random();
        this.velocity = Math.random();
    }

    update() {
        this.y += this.velocity;
    }
}