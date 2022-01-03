class Particle {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color;
        this.r = Math.random() * 10;
        this.xVel = Math.random() * 10 * (Math.random() < 0.5 ? -1 : 1);
        this.yVel = Math.random() * 10 * (Math.random() < 0.5 ? -1 : 1);
    }

    update() {
        // move particle and decrease size
        this.x += this.xVel;
        this.y += this.yVel;
        
        if(this.r >= 0.2)
            this.r -= 0.2;
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}