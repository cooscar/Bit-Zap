const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.3;
const jumpForce = -6.5;
const maxJumps = 2;
let isPaused = false;

class Player {
    constructor(position) {
        this.position = position;
        this.velocity = { x: 4, y: 0 };
        this.height = 30;
        this.width = 30;
        this.rotation = 0;
        this.isRotating = false;
        this.jumpsRemaining = maxJumps;
        this.isFrozen = false;
    }

    draw() {
        c.save();
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        c.rotate(this.rotation * Math.PI / 180);
        c.fillStyle = 'red';
        c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        c.restore();
    }

    update(levelData) {
        if (this.isFrozen) return;

        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y < canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
            this.jumpsRemaining = maxJumps;
        }

        if (this.isRotating) {
            this.rotation += 10;
            if (this.rotation >= 360) {
                this.rotation = 0;
                this.isRotating = false;
            }
        }

        this.checkCollision(levelData);
    }


    checkCollision(levelData) {
        let tileX = Math.floor(this.position.x / 32);
        let tileY = Math.floor((this.position.y + this.height) / 32);
    
        
        if (this.position.y + this.height >= canvas.height) {
            particleSystem.addParticles(this.position.x, this.position.y, 'red', 10);
            this.freeze(300);
            setTimeout(() => restartGame(), 300);
        }
        let death = this.position.y + 30
        if (this.position.y <= 0) {
            particleSystem.addParticles(this.position.x, death, 'red', 20);
            this.freeze(300);
            setTimeout(() => restartGame(), 300);
        }

        if (levelData[tileY] && levelData[tileY][tileX] === '1' && this.velocity.y >= 0) {
            this.position.y = tileY * 32 - this.height;
            this.velocity.y = 0;
            this.jumpsRemaining = maxJumps;
        }
    
        let leftTileX = Math.floor(this.position.x / 32);
        let leftTileY = Math.floor(this.position.y / 32);
        if (levelData[leftTileY] && levelData[leftTileY][leftTileX] === '1') {
            particleSystem.addParticles(this.position.x, this.position.y, 'red', 10);
            setTimeout(() => restartGame(), 300);
        }
        if (levelData[tileY] && levelData[tileY][tileX] === '2') { 
            particleSystem.addParticles(this.position.x, this.position.y, 'green', 10);
            completeLevel(selectedLevel);   
            this.freeze(300);
            setTimeout(() => restartGame(), 300);
            setTimeout(() => {
                showEndScreen();
                player.velocity = { x: 0, y: 0 }; 
            }, 500); 
        
        }
        if (levelData[leftTileY] && levelData[leftTileY][leftTileX] === '3') {
            particleSystem.addParticles(this.position.x, this.position.y, 'red', 10);
            this.freeze(300);
            setTimeout(() => restartGame(), 300);
        }
        if (levelData[leftTileY] && levelData[leftTileY][leftTileX] === '6') {
            particleSystem.addParticles(this.position.x, this.position.y, 'red', 10);
            this.freeze(300);
            setTimeout(() => restartGame(), 300);
        }

        
    
        let rightTileX = Math.floor((this.position.x + this.width) / 32);
        let rightTileY = Math.floor(this.position.y / 32);

        if (levelData[rightTileY] && levelData[rightTileY][rightTileX] === '1') {
            particleSystem.addParticles(this.position.x, this.position.y, 'red', 10);
            this.freeze(300);
            setTimeout(() => restartGame(), 300);
        }
    }
    
    freeze(duration) {
        this.isFrozen = true; 
        setTimeout(() => {
            this.isFrozen = false; 
        }, duration);
    }


    jump() {
        if (this.jumpsRemaining > 0) {
            this.velocity.y = jumpForce;
            this.isRotating = true;
            this.jumpsRemaining--;
        }
    }

    shouldPan({ camera }) {
        if (this.position.x + this.width > canvas.width / 2) {
            camera.position.x += this.velocity.x;
        }
    }
}

const player = new Player({ x: 0, y: 0 });

const camera = {
    position: {
        x: 0,
        y: 0,
    }
};

function showEndScreen() {
    document.getElementById('endScreen').classList.remove('hidden');
}

function hideEndScreen() {
    document.getElementById('endScreen').classList.add('hidden');
}

function restartGame() {
    hideEndScreen();
    player.position = { x: 100, y: 100 };
    player.velocity = { x: 4, y: 0 };
    player.rotation = 0;
    player.jumpsRemaining = maxJumps;
    camera.position = { x: 0, y: 0 };
}

function togglePause() {
    isPaused = !isPaused;
    const pauseOverlay = document.getElementById('pauseOverlay');
    pauseOverlay.style.display = isPaused ? 'flex' : 'none';

    if (!isPaused) {
        animate(); 
    }
}



function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const selectedLevel = getQueryParam('level') || 'level1.txt';

function animate() {
    if (isPaused) return;
    
    window.requestAnimationFrame(animate);

    c.fillStyle = 'purple';
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.save();
    c.translate(-camera.position.x, 0);

    if (typeof drawLevel === 'function') drawLevel();
    player.shouldPan({ camera });
    player.update(levelData);

    
    particleSystem.updateAndDraw(c);

    c.restore();
}


window.onload = () => {
    if (typeof loadLevel === 'function') {
        loadLevel(`./levels/${selectedLevel}`).then(() => {
            animate();
        });
    }
};

window.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w') {
        player.jump();
    }
    if (event.key === 'p') {
        togglePause();
    }
    if (event.key === 'r') {
        restartGame();
    }
});

window.addEventListener('mousedown', function (event) {
    if (event.button === 0) {
        player.jump();
    }
});

