const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', (event) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let ship = new Ship(canvas);
let enemies = [];
let particles = [];

// automatically fire a laser every 0.25 seconds
window.setInterval(() => {
    ship.fire();
}, 250);

// spawn 1 - 3 enemies at a random place every second
window.setInterval(() => {
    const enemiesToSpawn = Math.ceil(Math.random() * 3);

    for(let i = 0; i < enemiesToSpawn; i++) {
        let enemy = new Enemy(
            ctx,
            Math.random() * canvas.width,
            (Math.random() * 100) - 50,
            25,
            4
        );

        enemies.push(enemy);
    }
}, 750);

// ship follows mouse around the screen
document.addEventListener('mousemove', (event) => {
    ship.setPos(event.clientX, event.clientY);
});

// make sure screen doesn't scroll when using a touch screen
const preventDefault = (e) => {
    e.preventDefault();
}

// ship follows mouse around the screen - touch controls
document.addEventListener('touchmove', (event) => {
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
    ship.setPos(event.targetTouches[0].screenX, event.targetTouches[0].screenY);
});

const addExplosion = (x, y) => {
    for(let i = 0; i < 20; i++) {
        particles.push(new Particle(ctx, x, y));
    }
}

// check if any lasers hit an enemy
const checkEnemyHit = () => {
    ship.lasers.forEach((laser, laserIndx) => {
        enemies.forEach((enemy, enemyIndx) => {
            const laserIsInHitBox = laser.y + (laser.h / 2) <= enemy.hitBox.y + enemy.hitBox.h
                                        && laser.y + laser.h >= enemy.hitBox.y
                                        && laser.x + laser.w >= enemy.hitBox.x
                                        && laser.x <= enemy.hitBox.x + enemy.hitBox.w;
            if(laserIsInHitBox) {
                // if hit, decrement enemy health and remove the laser
                enemy.health -= 1;
                ship.lasers.splice(laserIndx, 1);

                // remove the enemy when their health gets to 0
                if(enemy.health <= 0) {
                    addExplosion(enemy.x, enemy.y);
                    enemies.splice(enemyIndx, 1);
                }
            }
        })
    });
}

const updateParticles = () => {
    particles.forEach((particle, indx) => {
        particle.update();
        particle.render();

        // remove particles if they get too small
        if(particle.r < 0.2)
            particles.splice(indx, 1);
    });
}

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ship.updateAndRenderLasers();
    ship.render();

    // update each enemy
    enemies.forEach(enemy => {
        enemy.update();
        enemy.render();
    });

    // check if any enemies are hit by a laser and remove them if they died
    checkEnemyHit();

    updateParticles();

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
