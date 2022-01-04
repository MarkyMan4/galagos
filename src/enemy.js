class Enemy {
    /*
     * enemies are circles, so they need coordinates and a radius
     * they will be given a random color
     * type should be an int which is either 1, 2, 3, 4. Type determines their size, velocity and health
     * 1 = weak
     * 2 = medium
     * 3 = strong
     * 4 = strongest
     * 
     * difficulty acts like a multiplier for enemy velocity, health and point value
     */
    constructor(ctx, x, y, type, difficulty) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;

        let radius;
        let velocity;
        let health;
        let color;
        let pointValue;

        // set radius, velocity, health, color and point value based on type of enemy
        if(type === 1) {
            radius = 25;
            velocity = 4;
            health = 3;
            color = '#9633FF';
            pointValue = 10;
        }
        else if(type === 2) {
            radius = 50;
            velocity = 2;
            health = 10;
            color = '#FCFC1F';
            pointValue = 50;
        }
        else if(type === 3) {
            radius = 100;
            velocity = 1;
            health = 50;
            color = '#FF3361';
            pointValue = 250;
        }
        else {
            radius = 150;
            velocity = 0.25;
            health = 100;
            color = '#3A87FD';
            pointValue = 750;
        }

        this.r = radius;
        this.velocity = velocity + difficulty;
        this.health = health + (health * (difficulty / 2)); // take 3 hits to kill an enemy
        this.maxHealth = this.health;
        this.color = color;
        this.pointValue = pointValue + (pointValue * (difficulty / 2)); // how many points the player gets for killing the enemy

        // anything that enters this box is considered to be touching this object
        // this box is slightly smaller than the enemy itself
        this.hitBox = new Rect(
            this.x - (this.r - 2),
            this.y - (this.r - 2),
            (this.r - 2) * 2,
            (this.r - 2) * 2
        );

        this.showHitBox = false; // set this to true for debugging
    }

    update() {
        // update the position of enemy and move it's hitbox with it
        this.y += this.velocity;
        this.hitBox.y += this.velocity;
    }

    render() {
        // draw the enemy
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke();

        // draw a health bar
        let healthBarX = this.x - this.r;
        let healthBarY = this.y - this.r - 12;

        // bar representing how much health is left
        this.ctx.beginPath();
        this.ctx.rect(healthBarX, healthBarY, (this.health / this.maxHealth) * (this.r * 2), 4);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();

        // outline of health bar
        this.ctx.beginPath();
        this.ctx.rect(healthBarX, healthBarY, this.r * 2, 4);
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke();

        // draw the hitbox if this option is set to true
        if(this.showHitBox) {
            this.ctx.beginPath();
            this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);
            this.ctx.strokeStyle = 'white';
            this.ctx.stroke();
        }
    }
}