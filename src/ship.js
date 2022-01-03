class Ship {
    SHIP_BODY_SIZE = 65;
    SHIP_WING_WIDTH = 60;
    SHIP_WING_HEIGHT = 40;
    SHIP_CANNON_WIDTH = 10;
    SHIP_CANNON_HEIGHT = 20;
    LASER_WIDTH = 10;
    LASER_HEIGHT = 30;
    LASER_VELOCITY = -15;

    // must be given a canvas it can draw to
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // x and y are considered the center of the ships body
        this.x = canvas.width / 2;
        this.y = canvas.height - 100;

        this.body = new Rect(
            this.x - (this.SHIP_BODY_SIZE / 2), 
            this.y - (this.SHIP_BODY_SIZE / 2),
            this.SHIP_BODY_SIZE,
            this.SHIP_BODY_SIZE
        );

        this.lasers = []; // list of lasers fired by this ship
        this.laserDamage = 0.8; // initial damage inflicted by 1 laser
        this.fireRate = 500; // initial milliseconds between lasers being fired
        this.numCannons = 1; // max of 3 cannons
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.updateShipPos();
    }

    updateShipPos() {
        this.body.x = this.x - (this.SHIP_BODY_SIZE / 2);
        this.body.y = this.y - (this.SHIP_BODY_SIZE / 2);
    }

    render() {
        // draw the ship body, cannon and wings
        this.ctx.beginPath();

        // ship body
        this.ctx.rect(this.body.x, this.body.y, this.body.w, this.body.h);

        // cannon
        this.ctx.rect(
            this.x - this.SHIP_CANNON_WIDTH / 2, 
            this.y - (this.SHIP_BODY_SIZE / 2) - this.SHIP_CANNON_HEIGHT, 
            this.SHIP_CANNON_WIDTH, 
            this.SHIP_CANNON_HEIGHT
        );

        // left wing
        this.ctx.moveTo(this.body.x, this.body.y + (this.body.h - this.SHIP_WING_HEIGHT));
        this.ctx.lineTo(this.body.x - this.SHIP_WING_WIDTH, this.body.y + this.body.h);
        this.ctx.lineTo(this.body.x, this.body.y + this.body.h - 10);

        // right wing
        this.ctx.moveTo(this.body.x + this.body.w, this.body.y + (this.body.h - this.SHIP_WING_HEIGHT));
        this.ctx.lineTo(this.body.x + this.body.w + this.SHIP_WING_WIDTH, this.body.y + this.body.h);
        this.ctx.lineTo(this.body.x + this.body.w, this.body.y + this.body.h - 10);

        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke();
    }

    addLaser(x, y) {
        const laser = new Laser(
            this.ctx, 
            x, 
            y, 
            this.LASER_WIDTH, 
            this.LASER_HEIGHT, 
            this.LASER_VELOCITY
        );

        this.lasers.push(laser);
    }

    // fire a laser from each cannon
    fire() {
        let baseX = this.x - (this.LASER_WIDTH / 2);
        let baseY = this.y - (this.SHIP_BODY_SIZE / 2) - this.SHIP_CANNON_HEIGHT;

        if(this.numCannons >= 1) {
            this.addLaser(baseX, baseY);
        }

        if(this.numCannons >= 2) {
            this.addLaser(baseX - 20, baseY + 20);
        }

        if(this.numCannons >= 3) {
            this.addLaser(baseX + 20, baseY + 20);
        }        
    }

    // call the functions to update and draw each laser fired by this ship
    updateAndRenderLasers() {
        this.lasers.forEach(laser => {
            laser.update();
            laser.render();
        });
    }
}