const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    draw() {
        ctx.fillStyle = "#FF0";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    flap() {
        this.velocity = this.lift;
    }
};

const pipes = [];
const pipeWidth = 20;
const pipeGap = 120;
let frameCount = 0;

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        ctx.fillStyle = "#0F0";
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top);
        ctx.fillRect(pipes[i].x, pipes[i].bottom, pipeWidth, canvas.height - pipes[i].bottom);
    }
}

function updatePipes() {
    if (frameCount % 90 === 0) {
        const topHeight = Math.random() * (canvas.height - pipeGap);
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + pipeGap
        });
    }
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
        }
    }
}

function detectCollision() {
    for (let i = 0; i < pipes.length; i++) {
        if (bird.x < pipes[i].x + pipeWidth &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].top || bird.y + bird.height > pipes[i].bottom)) {
            alert('Game Over');
            document.location.reload();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.draw();
    drawPipes();
}

function update() {
    bird.update();
    updatePipes();
    detectCollision();
    frameCount++;
}

function loop() {
    draw();
    update();
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        bird.flap();
    }
});

loop();
