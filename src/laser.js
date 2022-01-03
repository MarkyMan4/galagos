class Laser {
    COLOR = 'MediumSeaGreen';

    constructor(ctx, x, y, w, h, velocity) {
        this.ctx = ctx; // context used for drawing
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.velocity = velocity;
    }

    // move laser based on velocity
    update() {
        this.y += this.velocity;
    }

    // draw laser to the canvas
    render() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.w, this.h);
        this.ctx.fillStyle = this.COLOR;
        this.ctx.fill();
    }
}