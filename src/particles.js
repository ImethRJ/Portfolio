export class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    
    this.resizeCanvas();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.init(); // Reinitialize density on resize
  }

  init() {
    this.particles = [];
    // Adjust density based on screen width
    const density = window.innerWidth < 768 ? 40 : 100;
    
    for (let i = 0; i < density; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * (this.canvas.width - size * 2) + size;
      const y = Math.random() * (this.canvas.height - size * 2) + size;
      const directionX = (Math.random() * 0.4) - 0.2;
      const directionY = (Math.random() * 0.4) - 0.2;
      const color = 'rgba(2, 132, 199, 0.35)';
      
      this.particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.canvas);
      this.particles[i].draw(this.ctx);
    }
    this.connect();
  }

  connect() {
    let opacityValue = 1;
    const maxDistance = 120;
    
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a + 1; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x;
        const dy = this.particles[a].y - this.particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          opacityValue = 1 - (distance / maxDistance);
          // Accent colors for the lines on light canvas
          this.ctx.strokeStyle = `rgba(79, 70, 229, ${opacityValue * 0.12})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
          this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
          this.ctx.stroke();
        }
      }
      
      // Connect to mouse
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.particles[a].x - this.mouse.x;
        const dy = this.particles[a].y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          opacityValue = 1 - (distance / this.mouse.radius);
          this.ctx.strokeStyle = `rgba(2, 132, 199, ${opacityValue * 0.25})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }
    }
  }
}

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#0284C7';
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  }

  update(canvas) {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    this.x += this.directionX;
    this.y += this.directionY;
  }
}
