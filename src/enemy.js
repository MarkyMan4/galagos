class Enemy {
    // enemies are circles, so they need coordinates and a radius
    // they will be given a random color
    constructor(ctx, x, y, r, velocity) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.r = r;
        this.velocity = velocity;
        this.health = 3; // take 3 hits to kill an enemy

        // anything that enters this box is considered to be touching this object
        // this box is slightly smaller than the enemy itself
        this.hitBox = new Rect(
            x - (r - 2),
            y - (r - 2),
            (r - 2) * 2,
            (r - 2) * 2
        );

        this.showHitBox = false; // set this to true for debugging
    }

    update() {
        // update the position of enemy and move it's hitbox with it
        this.y += this.velocity;
        this.hitBox.y += this.velocity;
    }

    render() {        
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        this.ctx.fillStyle = '#9633FF';
        this.ctx.fill();

        if(this.showHitBox) {
            this.ctx.beginPath();
            this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);
            this.ctx.strokeStyle = 'white';
            this.ctx.stroke();
        }
    }
}