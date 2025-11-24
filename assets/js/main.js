const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// ---------------------------
// PARTICLES
// ---------------------------
const particles = [];
const PARTICLE_COUNT = 40;

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 1 + Math.random() * 3;
        this.alpha = 0.1 + Math.random() * 0.18;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// ===========================
// Elements
// ===========================
const elements = [];
const ELEMENT_COUNT = 15;

class Element {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.speed = 0.3 + Math.random() * 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.rotateAngle = Math.random() * Math.PI * 2;

        this.size = 10 + Math.random() * 20;

        this.type = Math.floor(Math.random() * 3); // 0 sakura, 1 five-petal, 2 daisy
        this.color = this.randomColor();

        this.trail = [];
    }

    randomColor() {
        const colors = [
            "#ffb7c5", // sakura pink
            "#ffa8e2",
            "#fff2b2",
            "#b5e8ff",
            "#e4ffe1",
            "#ffc7a6",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        // drifting flight
        this.angle += (Math.random() - 0.5) * 0.1;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // wrap
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;

        // rotation
        this.rotateAngle += 0.01 + Math.random() * 0.01;

        // trail
        this.trail.push({ x: this.x, y: this.y, alpha: 0.25 });
        if (this.trail.length > 10) this.trail.shift();
        this.trail.forEach((t) => (t.alpha -= 0.02));
    }

    drawTrail() {
        for (const t of this.trail) {
            ctx.globalAlpha = t.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    draw() {
        this.drawTrail();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotateAngle);

        if (this.type === 0) {
            // SAKURA PETAL
            this.drawSakura();
        } else if (this.type === 1) {
            // 5-PETAL FLOWER
            this.drawFivePetal();
        } else {
            // DAISY / PUFF
            this.drawDaisy();
        }

        ctx.restore();
    }

    drawSakura() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 1.3, this.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFivePetal() {
        ctx.fillStyle = this.color;
        for (let i = 0; i < 5; i++) {
            ctx.rotate((Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.ellipse(this.size, 0, this.size * 0.6, this.size * 1.2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        // center
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawDaisy() {
        ctx.fillStyle = this.color + "aa";
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < ELEMENT_COUNT; i++) elements.push(new Element());

// ---------------------------
// ANIMATE
// ---------------------------
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
        p.update();
        p.draw();
    });
    elements.forEach((f) => {
        f.update();
        f.draw();
    });

    requestAnimationFrame(animate);
}
animate();

addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});
