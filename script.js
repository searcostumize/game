const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImg = new Image();
playerImg.src = 'player.png';

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

const platforms = [
    { x: 100, y: 300, width: 100, height: 10 },
    { x: 250, y: 250, width: 100, height: 10 },
    { x: 400, y: 200, width: 100, height: 10 }
];

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

loop();
