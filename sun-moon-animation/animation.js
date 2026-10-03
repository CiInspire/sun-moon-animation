/**
 * ============================================================================
 * ORBITAL UI - SUN & MOON INTERACTIVE CANVASE ENGINE (ChatGPT Style)
 * ============================================================================
 * Motor de Animação 2D/3D com Morfe Matemático, Partículas Magnéticas e Rays
 */

class SunMoonEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas com ID '${canvasId}' não encontrado.`);
      return;
    }
    this.ctx = this.canvas.getContext('2d');

    // Estado da Animação
    this.morphProgress = 0; // 0.0 (Sol) -> 1.0 (Lua)
    this.targetMorph = 0;
    this.morphSpeed = 0.05;

    // Configurações e Parâmetros
    this.particleCount = 120;
    this.speedMultiplier = 1.0;
    this.gravityStrength = 1.2;
    this.glowIntensity = 1.0;

    // Dimensões e Posição
    this.width = 0;
    this.height = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.baseRadius = 80;

    // Interatividade do Mouse
    this.mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      isHovered: false,
      isDown: false,
      tiltX: 0,
      tiltY: 0
    };

    // Coleções da Animação
    this.particles = [];
    this.solarRays = [];
    this.shockwaves = [];
    this.lunarCraters = [];

    // Controle de FPS e Tempo
    this.time = 0;
    this.lastFrameTime = performance.now();
    this.fps = 60;

    // Inicialização
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Eventos de Ponteiro e Mouse
    this.setupInteractivity();

    // Inicializar Crateras da Lua
    this.initCraters();

    // Inicializar Feixes do Sol
    this.initSolarRays();

    // Criar Partículas
    this.createParticles();

    // Loop de Animação
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    this.width = rect.width;
    this.height = rect.height;
    
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    
    this.ctx.scale(dpr, dpr);

    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.baseRadius = Math.min(this.width, this.height) * 0.18;
  }

  setupInteractivity() {
    const parent = this.canvas.parentElement;

    const updateMouse = (e) => {
      const rect = parent.getBoundingClientRect();
      this.mouse.targetX = e.clientX - rect.left;
      this.mouse.targetY = e.clientY - rect.top;
      this.mouse.isHovered = true;
    };

    parent.addEventListener('mousemove', updateMouse);

    parent.addEventListener('mouseleave', () => {
      this.mouse.isHovered = false;
      this.mouse.targetX = this.centerX;
      this.mouse.targetY = this.centerY;
    });

    parent.addEventListener('mousedown', () => {
      this.mouse.isDown = true;
      this.triggerPulse();
    });

    parent.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    // Suporte para Telas Touch
    parent.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        updateMouse(e.touches[0]);
      }
    }, { passive: true });
  }

  initCraters() {
    this.lunarCraters = [
      { x: -0.2, y: -0.2, r: 0.22, opacity: 0.35 },
      { x: 0.15, y: 0.25, r: 0.18, opacity: 0.28 },
      { x: -0.3, y: 0.3, r: 0.15, opacity: 0.3 },
      { x: 0.1, y: -0.35, r: 0.12, opacity: 0.22 }
    ];
  }

  initSolarRays() {
    this.solarRays = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      this.solarRays.push({
        angle: angle,
        lengthMult: 0.4 + Math.random() * 0.5,
        width: 2 + Math.random() * 4,
        pulseSpeed: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.generateParticle());
    }
  }

  generateParticle() {
    const angle = Math.random() * Math.PI * 2;
    const distance = this.baseRadius * (1.1 + Math.random() * 1.8);
    return {
      angle: angle,
      distance: distance,
      baseDistance: distance,
      size: 1.5 + Math.random() * 3,
      speed: (0.005 + Math.random() * 0.012) * (Math.random() > 0.5 ? 1 : -1),
      radialOffset: Math.random() * Math.PI * 2,
      opacity: 0.2 + Math.random() * 0.8,
      hueOffset: (Math.random() - 0.5) * 40,
      vx: 0,
      vy: 0,
      x: 0,
      y: 0
    };
  }

  triggerPulse() {
    this.shockwaves.push({
      radius: this.baseRadius * 0.8,
      maxRadius: this.baseRadius * 2.8,
      opacity: 0.9,
      speed: 4 + Math.random() * 2
    });

    // Disparar faíscas rápidas
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      this.particles.push({
        angle: angle,
        distance: this.baseRadius * 0.9,
        baseDistance: this.baseRadius * 2.5,
        size: 2 + Math.random() * 2.5,
        speed: speed * 0.01,
        radialOffset: 0,
        opacity: 1,
        hueOffset: Math.random() * 30,
        isBurst: true,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        x: this.centerX,
        y: this.centerY
      });
    }
  }

  update(deltaTime) {
    this.time += 0.015 * this.speedMultiplier;

    // Interpolação suave do morfe
    this.morphProgress += (this.targetMorph - this.morphProgress) * this.morphSpeed;

    // Suavização da posição do mouse
    if (this.mouse.isHovered) {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;
    } else {
      this.mouse.x += (this.centerX - this.mouse.x) * 0.05;
      this.mouse.y += (this.centerY - this.mouse.y) * 0.05;
    }

    // Cálculo do Tilt 3D
    const targetTiltX = (this.mouse.x - this.centerX) / (this.width / 2);
    const targetTiltY = (this.mouse.y - this.centerY) / (this.height / 2);
    this.mouse.tiltX += (targetTiltX - this.mouse.tiltX) * 0.08;
    this.mouse.tiltY += (targetTiltY - this.mouse.tiltY) * 0.08;

    // Atualizar Partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.isBurst) {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.02;
        if (p.opacity <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
      } else {
        // Movimento Orbital
        p.angle += p.speed * this.speedMultiplier;
        const currentDist = p.baseDistance + Math.sin(this.time * 2 + p.radialOffset) * 12;

        let px = this.centerX + Math.cos(p.angle) * currentDist;
        let py = this.centerY + Math.sin(p.angle) * currentDist;

        // Gravidade Magnética ao passar o mouse
        if (this.mouse.isHovered) {
          const dx = this.mouse.x - px;
          const dy = this.mouse.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 15 * this.gravityStrength;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }
        }

        p.x = px;
        p.y = py;
      }
    }

    // Manter densidade de partículas
    while (this.particles.filter(p => !p.isBurst).length < this.particleCount) {
      this.particles.push(this.generateParticle());
    }
    while (this.particles.filter(p => !p.isBurst).length > this.particleCount) {
      this.particles.pop();
    }

    // Atualizar Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.opacity -= 0.025;
      if (sw.opacity <= 0 || sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Deslocamento Parallax com base no Tilt
    const offsetX = this.mouse.tiltX * 25;
    const offsetY = this.mouse.tiltY * 25;
    const currentCenterX = this.centerX + offsetX;
    const currentCenterY = this.centerY + offsetY;

    // 1. Desenhar Brilho Atmosférico (Ambient Halo Glow)
    this.drawAtmosphere(currentCenterX, currentCenterY);

    // 2. Desenhar Feixes Solares Pulsantes (Apenas no modo Sol/Transição)
    if (this.morphProgress < 0.95) {
      this.drawSolarRays(currentCenterX, currentCenterY);
    }

    // 3. Desenhar Esfera Central Morfada (Sol -> Lua)
    this.drawMorphedOrb(currentCenterX, currentCenterY);

    // 4. Desenhar Partículas Orbitantes
    this.drawParticles();

    // 5. Desenhar Ondas de Choque (Shockwaves)
    this.drawShockwaves(currentCenterX, currentCenterY);
  }

  drawAtmosphere(cx, cy) {
    const t = this.morphProgress;
    const r = this.baseRadius * (1.6 + Math.sin(this.time) * 0.08) * this.glowIntensity;

    // Cores: Âmbar Solar (t=0) -> Roxo/Ciano Lunar (t=1)
    const sunGlow = `hsla(32, 100%, 50%, ${0.35 * (1 - t)})`;
    const moonGlow = `hsla(260, 85%, 65%, ${0.35 * t})`;

    const grad = this.ctx.createRadialGradient(cx, cy, this.baseRadius * 0.4, cx, cy, r);
    grad.addColorStop(0, t < 0.5 ? sunGlow : moonGlow);
    grad.addColorStop(0.6, t < 0.5 ? `hsla(20, 100%, 50%, ${0.15 * (1 - t)})` : `hsla(210, 90%, 60%, ${0.15 * t})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawSolarRays(cx, cy) {
    const opacityMult = (1 - this.morphProgress);
    if (opacityMult <= 0.01) return;

    this.ctx.save();
    this.solarRays.forEach(ray => {
      const currentAngle = ray.angle + this.time * 0.2;
      const pulse = Math.sin(this.time * ray.pulseSpeed + ray.phase) * 0.2;
      const length = this.baseRadius * (1 + (ray.lengthMult + pulse) * opacityMult);

      const x1 = cx + Math.cos(currentAngle) * (this.baseRadius * 0.85);
      const y1 = cy + Math.sin(currentAngle) * (this.baseRadius * 0.85);
      const x2 = cx + Math.cos(currentAngle) * length;
      const y2 = cy + Math.sin(currentAngle) * length;

      const rayGrad = this.ctx.createLinearGradient(x1, y1, x2, y2);
      rayGrad.addColorStop(0, `rgba(255, 200, 100, ${0.8 * opacityMult})`);
      rayGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');

      this.ctx.strokeStyle = rayGrad;
      this.ctx.lineWidth = ray.width * (1 - this.morphProgress * 0.5);
      this.ctx.lineCap = 'round';

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    });
    this.ctx.restore();
  }

  drawMorphedOrb(cx, cy) {
    const t = this.morphProgress;
    const r = this.baseRadius;

    this.ctx.save();

    // Interpolação de Cores do Núcleo
    // Sol: Amarelo/Dourado -> Lua: Azul/Ciano Prateado
    const coreGrad = this.ctx.createRadialGradient(
      cx - r * 0.3 * (1 - t), cy - r * 0.3 * (1 - t), r * 0.1,
      cx, cy, r
    );

    if (t < 0.5) {
      coreGrad.addColorStop(0, '#fff5cc');
      coreGrad.addColorStop(0.4, '#ff9f43');
      coreGrad.addColorStop(1, '#ee5253');
    } else {
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.35, '#a29bfe');
      coreGrad.addColorStop(1, '#6c5ce7');
    }

    // Desenhar a base circular principal
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fillStyle = coreGrad;
    this.ctx.fill();

    // Efeito de Morfe da Lua Crescente (Recorte com Círculo de Sombra)
    if (t > 0.01) {
      // O círculo de recorte se aproxima conforme t avança
      // t=0 -> cutout dist longe (sol inteiro)
      // t=1 -> cutout dist ideal (crescente perfeita)
      const cutoutOffsetR = r * (2.4 - t * 1.8); 
      const cutoutX = cx + cutoutOffsetR * 0.65;
      const cutoutY = cy - cutoutOffsetR * 0.3;
      const cutoutRadius = r * 0.92;

      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.beginPath();
      this.ctx.arc(cutoutX, cutoutY, cutoutRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 0, 0, ${t})`;
      this.ctx.fill();
      this.ctx.globalCompositeOperation = 'source-over';

      // Desenhar Sombra Interior Sutil na Crescente da Lua
      if (t > 0.4) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.clip();

        this.drawCraters(cx, cy, r, t);
        this.ctx.restore();
      }
    }

    // Brilho Neon na Borda (Corona Highlight)
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.strokeStyle = t < 0.5 ? 'rgba(255, 220, 150, 0.6)' : 'rgba(162, 155, 254, 0.8)';
    this.ctx.lineWidth = 2 + Math.sin(this.time * 3) * 0.8;
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawCraters(cx, cy, r, t) {
    const craterOpacity = (t - 0.4) * 1.6;
    if (craterOpacity <= 0) return;

    this.ctx.fillStyle = `rgba(40, 30, 90, ${craterOpacity * 0.4})`;
    this.lunarCraters.forEach(c => {
      const crx = cx + c.x * r;
      const cry = cy + c.y * r;
      const crRadius = c.r * r;

      this.ctx.beginPath();
      this.ctx.arc(crx, cry, crRadius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawParticles() {
    const t = this.morphProgress;

    this.particles.forEach(p => {
      // Cor da partícula varia entre Fóton Solar (Dourado/Vermelho) e Poeira Estelar (Azul/Branco)
      const hue = t < 0.5 
        ? 30 + p.hueOffset 
        : 230 + p.hueOffset;

      const alpha = p.opacity * (0.6 + Math.sin(this.time * 4 + p.radialOffset) * 0.4);

      this.ctx.fillStyle = `hsla(${hue}, 95%, ${t < 0.5 ? '65%' : '80%'}, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Brilho ao redor de partículas maiores
      if (p.size > 2.2) {
        this.ctx.fillStyle = `hsla(${hue}, 100%, 75%, ${alpha * 0.3})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
  }

  drawShockwaves(cx, cy) {
    const t = this.morphProgress;
    this.shockwaves.forEach(sw => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = t < 0.5 
        ? `rgba(255, 159, 67, ${sw.opacity})` 
        : `rgba(162, 155, 254, ${sw.opacity})`;
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  loop(timestamp) {
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    this.fps = Math.round(1000 / (deltaTime || 16.6));

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  // --- API Pública de Controle ---
  setTargetMorph(val) {
    this.targetMorph = Math.max(0, Math.min(1, val));
  }

  setParticleCount(count) {
    this.particleCount = parseInt(count, 10);
  }

  setSpeedMultiplier(speed) {
    this.speedMultiplier = parseFloat(speed);
  }

  setGravityStrength(gravity) {
    this.gravityStrength = parseFloat(gravity);
  }

  setGlowIntensity(glow) {
    this.glowIntensity = parseFloat(glow);
  }
}
