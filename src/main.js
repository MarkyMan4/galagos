const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const damageUpCostDisplay = document.getElementById('damage-up-cost');
const fireRateUpCostDisplay = document.getElementById('fire-rate-up-cost');
const cannonsUpCostDisplay = document.getElementById('cannons-up-cost');
const pointsDisplay = document.getElementById('points-display');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', (event) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let stars = [];
let ship = new Ship(canvas);
let enemies = [];
let particles = [];
let paused = false;
let points = 0;
let damageUpgradeCost = 100;
let fireRateUpgradeCost = 100;
let cannonsUpgradeCost = 10000;

// create initial stars for the background
for(let i = 0; i < 750; i++) {
    stars.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height));
}

// spawn stars continuously
window.setInterval(() => {
    if(!paused)
        stars.push(new Star(Math.random() * canvas.width, -5));
}, 100);

const updatePointsDisplay = () => {
    pointsDisplay.innerHTML = 'Points available: ' + points;
}

const updateCostDisplays = () => {
    // show the cost of each upgrade
    damageUpCostDisplay.innerHTML = 'Cost: ' + damageUpgradeCost;
    fireRateUpCostDisplay.innerHTML = 'Cost: ' + fireRateUpgradeCost;
    cannonsUpCostDisplay.innerHTML = 'Cost: ' + cannonsUpgradeCost;
}

// when m pressed, pause game and open menu
document.addEventListener('keydown', (event) => {
    if(event.key === 'm') {
        console.log('yea');
        paused = true;
        menu.style.display = 'block';

        updateCostDisplays();
        updatePointsDisplay();
    }
});

const resumeGame = () => {
    menu.style.display = 'none';

    // wait a couple seconds before resuming so the player can move their mouse back into position
    setTimeout(() => {paused = false}, 2000);
}

// called when the player purchases a damage upgrade
const upgradeDamage = () => {
    // make sure the player has enough points
    if(points >= damageUpgradeCost) {
        // multiply the current damage dealt by 1.5
        ship.laserDamage *= 1.5;

        // decrement player points by the current cost, then double the cost of the next upgrade
        points -= damageUpgradeCost;
        damageUpgradeCost *= 2;

        // update labels in the menu
        updateCostDisplays();
        updatePointsDisplay();
    }
}

// automatically fire a laser every 0.25 seconds
window.setInterval(() => {
    if(!paused)
        ship.fire();
}, 250);

// spawn 1 - 3 enemies at a random place every second
window.setInterval(() => {
    if(!paused) {
        const enemiesToSpawn = Math.ceil(Math.random() * 3);

        for(let i = 0; i < enemiesToSpawn; i++) {
            /*
             * 60% chance of spawning weak enemy
             * 30% chance of spawning medium enemy
             * 7% chance of spawning strong enemy
             * 3% chance of spawning strongest enemy
             */
            let enemyType = 1;
            let chance = Math.random();

            if(chance <= 0.4 && chance > 0.1)
                enemyType = 2;
            else if(chance <= 0.1 && chance > 0.03)
                enemyType = 3;
            else if(chance <= 0.03)
                enemyType = 4;

            let enemy = new Enemy(
                ctx,
                Math.random() * canvas.width,
                (Math.random() * 100) - 50,
                enemyType
            );

            enemies.push(enemy);
        }
    }
}, 750);

// ship follows mouse around the screen
document.addEventListener('mousemove', (event) => {
    if(!paused)
        ship.setPos(event.clientX, event.clientY);
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
                enemy.health -= ship.laserDamage;
                ship.lasers.splice(laserIndx, 1);

                // remove the enemy when their health gets to 0 and give the player 10 points
                if(enemy.health <= 0) {
                    points += enemy.pointValue;
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

const drawPoints = () => {
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(`Points: ${points}`, (canvas.width / 2), 40);
    ctx.strokeStyle = 'black';
    ctx.strokeText(`Points: ${points}`, (canvas.width / 2), 40);
}

const drawAndUpdateStars = () => {
    stars.forEach(star => {
        star.update();

    
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    });
}

/*
 * Remove objects as they go off the screen
 * This includes:
 * - stars
 * - lasers
 * - enemies
 */
const removeOffscreenObjects = () => {
    stars.forEach((star, indx) => {
        if(star.y - star.r > canvas.height) {
            stars.splice(indx, 1);
        }
    });

    enemies.forEach((enemy, indx) => {
        if(enemy.y - enemy.r > canvas.height) {
            enemies.splice(indx, 1);
        }
    });

    ship.lasers.forEach((laser, indx) => {
        if(laser.x + laser.height < 0) {
            ship.lasers.splice(indx, 1);
        }
    });
}

const animate = () => {

    if(!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAndUpdateStars();
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
        drawPoints();
        removeOffscreenObjects();
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
