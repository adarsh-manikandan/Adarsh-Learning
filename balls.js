class Ball {
    constructor(x, y, radius, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.mass = radius; // Mass proportional to size
        this.friction = 0.99; // Very slight friction for more realistic feel
    }

    update(canvas, balls) {
        // Update position with slower speed
        this.x += this.dx;
        this.y += this.dy;

        // Handle ball-to-ball collisions
        balls.forEach(otherBall => {
            if (otherBall === this) return;

            const dx = otherBall.x - this.x;
            const dy = otherBall.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + otherBall.radius) {
                // Collision detected - calculate new velocities
                const normalX = dx / distance;
                const normalY = dy / distance;

                // Relative velocity
                const relativeVelocityX = this.dx - otherBall.dx;
                const relativeVelocityY = this.dy - otherBall.dy;

                // Calculate impulse
                const impulse = 2 * (normalX * relativeVelocityX + normalY * relativeVelocityY) 
                             / (1/this.mass + 1/otherBall.mass);

                // Apply impulse
                this.dx -= (impulse * normalX) / this.mass;
                this.dy -= (impulse * normalY) / this.mass;
                otherBall.dx += (impulse * normalX) / otherBall.mass;
                otherBall.dy += (impulse * normalY) / otherBall.mass;

                // Prevent sticking by separating balls
                const overlap = (this.radius + otherBall.radius - distance) / 2;
                this.x -= overlap * normalX;
                this.y -= overlap * normalY;
                otherBall.x += overlap * normalX;
                otherBall.y += overlap * normalY;
            }
        });

        // Wall collisions with slight energy loss
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.dx = -this.dx * this.friction;
        }
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.dx = -this.dx * this.friction;
        }
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.dy = -this.dy * this.friction;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.dy = -this.dy * this.friction;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// Setup canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Create balls with varying sizes
const balls = [];
const colors = [
    '#FF3333', // Bright red
    '#33FF33', // Bright green
    '#3333FF', // Bright blue
    '#FFFF33', // Bright yellow
    '#FF33FF'  // Bright magenta
];

for (let i = 0; i < 5; i++) {
    const radius = 15 + Math.random() * 15; // Random size between 15 and 30
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const dx = (Math.random() - 0.5) * 4; // Slower initial speed
    const dy = (Math.random() - 0.5) * 4; // Slower initial speed
    const color = colors[i];
    
    balls.push(new Ball(x, y, radius, dx, dy, color));
}

// Animation loop
function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw balls
    balls.forEach(ball => {
        ball.update(canvas, balls);
        ball.draw(ctx);
    });

    // Continue animation
    requestAnimationFrame(animate);
}

// Start animation
animate(); 