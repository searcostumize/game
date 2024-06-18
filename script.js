const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Laad de afbeelding
const playerImg = new Image();
playerImg.src = 'player.png'; // Zorg ervoor dat het pad correct is

const player = {
    x: 50,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false,
    draw() {
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    },
    update() {
        this.dy += this.gravity;
        this.y += this.dy;
        this.x += this.dx;
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.dy = 0;
            this.grounded = true;
        }
        if (this.y < 0) {
            this.y = 0;
            this.dy = 0;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    },
    jump() {
        if (this.grounded) {
            this.dy = this.jumpPower;
            this.grounded = false;
        }
    }
};

const platforms = [];
const platformCount = 10; // Aantal platforms
const platformGapMin = 80; // Minimale verticale afstand tussen platforms
const platformGapMax = 150; // Maximale verticale afstand tussen platforms
const platformWidth = 100;
const platformHeight = 10;
const playerJumpDistance = 150; // Maximaal horizontale sprongafstand van de speler

function generateRandomPlatforms() {
    let previousPlatform = { x: 50, y: canvas.height - 60, width: platformWidth, height: platformHeight };
    platforms.push(previousPlatform);

    for (let i = 1; i < platformCount; i++) {
        const x = Math.random() * (canvas.width - platformWidth);
        const y = previousPlatform.y - (platformGapMin + Math.random() * (platformGapMax - platformGapMin));
        
        // Zorg ervoor dat het nieuwe platform binnen sprongafstand van het vorige ligt
        if (Math.abs(x - previousPlatform.x) > playerJumpDistance) {
            if (x < previousPlatform.x) {
                x = previousPlatform.x - playerJumpDistance + Math.random() * (canvas.width - (previousPlatform.x - playerJumpDistance));
            } else {
                x = previousPlatform.x + Math.random() * (playerJumpDistance - previousPlatform.x);
            }
        }

        const platform = { x, y, width: platformWidth, height: platformHeight };
        platforms.push(platform);
        previousPlatform = platform;
    }
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function detectCollision() {
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {
            player.dy = 0;
            player.y = platform.y - player.height;
            player.grounded = true;
        }
    });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    player.update();
    detectCollision();
}

function draw() {
    clear();
    player.draw();
    drawPlatforms();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Beweeg de speler
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') {
        player.dx = player.speed;
    } else if (e.code === 'ArrowLeft') {
        player.dx = -player.speed;
    } else if (e.code === 'Space') {
        player.jump();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
        player.dx = 0;
    }
});

// Start het spel pas als de afbeelding is geladen
playerImg.onload = function() {
    generateRandomPlatforms();
    loop();
};
