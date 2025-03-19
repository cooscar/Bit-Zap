class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: Math.random() * -2,
        };
        this.alpha = 1;
        this.color = color;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.02;
    }

    draw(c) {
        c.globalAlpha = this.alpha;
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.globalAlpha = 1;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    addParticles(x, y, color, amount = 10) {
        for (let i = 0; i < amount; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    updateAndDraw(c) {
        this.particles.forEach((particle, index) => {
            if (particle.alpha <= 0) {
                this.particles.splice(index, 1);
            } else {
                particle.update();
                particle.draw(c);
            }
        });
    }
}

const particleSystem = new ParticleSystem();
