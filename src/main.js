const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const damageUpCostDisplay = document.getElementById('damage-up-cost');
const fireRateUpCostDisplay = document.getElementById('fire-rate-up-cost');
const cannonsUpCostDisplay = document.getElementById('cannons-up-cost');
const pointsDisplay = document.getElementById('points-display');
const upgradeFireRateBtn = document.getElementById('upgrade-fire-rate-btn');
const upgradeCannonBtn = document.getElementById('upgrade-cannon-btn');

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
let cannonsUpgradeCost = 7500;

// maximum # of times each upgrade can be purchased (no limit on damage)
let fireRateUpgradesPurchased = 0;
let maxFireRateUpgrades = 10;
let cannonUpgradesPurchased = 0;
let maxCannonsUpgrades = 2;

let difficulty = 0;
let upgradesPurchased = 0; // difficulty increases every 5 upgrade purchases

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

    if(fireRateUpgradesPurchased >= maxFireRateUpgrades) {
        fireRateUpCostDisplay.innerHTML = 'Maxed out';
        upgradeFireRateBtn.disabled = true;
    }
    else {
        fireRateUpCostDisplay.innerHTML = 'Cost: ' + fireRateUpgradeCost;
    }

    if(cannonUpgradesPurchased >= maxCannonsUpgrades) {
        cannonsUpCostDisplay.innerHTML = 'Maxed out';
        upgradeCannonBtn.disabled = true;
    }
    else {
        cannonsUpCostDisplay.innerHTML = 'Cost: ' + cannonsUpgradeCost;
    }
}

// when m pressed, pause game and open menu
document.addEventListener('keydown', (event) => {
    if(event.key === 'm') {
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

// automatically fire a laser - based on the ships fire rate
let fireRateInterval = setInterval(() => {
    if(!paused)
        ship.fire();
}, ship.fireRate);

// Call this method whenever upgrades are purchased. Increase the difficulty every 5 purchases
const checkDifficultyIncrease = () => {
    if(upgradesPurchased !== 0 && upgradesPurchased % 5 === 0)
        difficulty++;
}

// called when the player purchases a damage upgrade
const upgradeDamage = () => {
    // make sure the player has enough points
    if(points >= damageUpgradeCost) {
        // multiply the current damage dealt by 1.5
        ship.laserDamage *= 1.25;

        // decrement player points by the current cost, then double the cost of the next upgrade
        points -= damageUpgradeCost;
        damageUpgradeCost = Math.floor(damageUpgradeCost * 1.75); // keep it a whole number

        upgradesPurchased++;
        checkDifficultyIncrease();

        // update labels in the menu
        updateCostDisplays();
        updatePointsDisplay();
    }
}

// TODO: cap this at a certain fire rate
const upgradeFireRate = () => {
    if(points >= fireRateUpgradeCost) {
        ship.fireRate -= 40;

        // decrement player points by the current cost, then double the cost of the next upgrade
        points -= fireRateUpgradeCost;
        fireRateUpgradeCost = Math.floor(fireRateUpgradeCost * 1.75); // keep it a whole number

        upgradesPurchased++;
        fireRateUpgradesPurchased++;
        checkDifficultyIncrease();

        // update labels in the menu
        updateCostDisplays();
        updatePointsDisplay();

        // reset the interval that fires lasers to use the new fire rate
        clearInterval(fireRateInterval);
        fireRateInterval = setInterval(() => {
            if(!paused)
                ship.fire();
        }, ship.fireRate);
    }
}

// TODO: cap this at three
const upgradeCannons = () => {
    if(points >= cannonsUpgradeCost) {
        ship.numCannons++;

        // decrement player points by the current cost, then double the cost of the next upgrade
        points -= cannonsUpgradeCost;
        cannonsUpgradeCost = Math.floor(cannonsUpgradeCost * 2); // keep it a whole number

        upgradesPurchased++;
        cannonUpgradesPurchased++;
        checkDifficultyIncrease();

        // update labels in the menu
        updateCostDisplays();
        updatePointsDisplay();
    }
}

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
                ((Math.random() * 150) + 150) * -1,
                enemyType,
                difficulty
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

// explosion animation when an enemy blows up
const addEnemyExplosion = (x, y) => {
    for(let i = 0; i < 20; i++) {
        particles.push(new Particle(ctx, x, y, 'DodgerBlue'));
    }
}

// explosion animation when a laser hits an enemy
const addLaserExplosion = (x, y) => {
    for(let i = 0; i < 5; i++) {
        particles.push(new Particle(ctx, x, y, 'white'));
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
                addLaserExplosion(laser.x, laser.y);
                ship.lasers.splice(laserIndx, 1);

                // remove the enemy when their health gets to 0 and give the player 10 points
                if(enemy.health <= 0) {
                    points += enemy.pointValue;
                    addEnemyExplosion(enemy.x, enemy.y);
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
    // score
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(`Points: ${points}`, (canvas.width / 2), 40);
    ctx.strokeStyle = 'black';
    ctx.strokeText(`Points: ${points}`, (canvas.width / 2), 40);

    // text telling how to open menu
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText("Press 'm' to see upgrades", (canvas.width / 2), 80);
    ctx.strokeStyle = 'black';
    ctx.strokeText("Press 'm' to see upgrades", (canvas.width / 2), 80);
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
