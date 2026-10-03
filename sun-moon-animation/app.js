/**
 * ============================================================================
 * ORBITAL UI - APPLICATION CONTROLLER (app.js)
 * ============================================================================
 * Conecta os elementos da interface com o motor de animação e gerencia o código.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar o Motor da Animação
  const engine = new SunMoonEngine('sunMoonCanvas');

  // Elementos do DOM
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeBtnText = document.getElementById('themeBtnText');
  const btnModeSun = document.getElementById('btnModeSun');
  const btnModeMoon = document.getElementById('btnModeMoon');
  const morphSliderInline = document.getElementById('morphSliderInline');
  const morphPercentage = document.getElementById('morphPercentage');
  const hudMode = document.getElementById('hudMode');
  const triggerPulseBtn = document.getElementById('triggerPulseBtn');
  const ambientGlow = document.getElementById('ambientGlow');
  const canvasStage = document.getElementById('canvasStage');

  // Sliders de Parâmetros
  const paramParticles = document.getElementById('paramParticles');
  const valParticles = document.getElementById('valParticles');
  const paramSpeed = document.getElementById('paramSpeed');
  const valSpeed = document.getElementById('valSpeed');
  const paramGravity = document.getElementById('paramGravity');
  const valGravity = document.getElementById('valGravity');
  const paramGlow = document.getElementById('paramGlow');
  const valGlow = document.getElementById('valGlow');
  const btnResetParams = document.getElementById('btnResetParams');

  // Código e Copiar
  const codeSnippet = document.getElementById('codeSnippet');
  const btnCopyCode = document.getElementById('btnCopyCode');
  const copyBtnLabel = document.getElementById('copyBtnLabel');
  const tabBtns = document.querySelectorAll('.tab-btn');

  // Snippets de Código para Exportação
  const codeSnippets = {
    js: `// =========================================================
// IMPLEMENTAÇÃO JAVASCRIPT CANVAS 2D (SOL & LUA INTERATIVO)
// =========================================================

class SunMoonHeroAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.morphProgress = 0; // 0 = Sol, 1 = Lua
    this.targetMorph = 0;
    this.time = 0;
    this.particles = [];
    this.mouse = { x: 0, y: 0, isHovered: false };
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Suporte a Mouse e Interatividade 3D Tilt
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.isHovered = true;
    });

    this.canvas.addEventListener('click', () => {
      this.toggleMode();
    });

    this.createParticles(120);
    this.animate();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.parentElement.clientHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = Math.min(this.width, this.height) * 0.18;
  }

  createParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = this.radius * (1.1 + Math.random() * 1.6);
      this.particles.push({
        angle, dist, baseDist: dist,
        speed: 0.005 + Math.random() * 0.01,
        size: 1.5 + Math.random() * 3,
        opacity: Math.random()
      });
    }
  }

  toggleMode() {
    this.targetMorph = this.targetMorph === 0 ? 1 : 0;
  }

  animate() {
    this.time += 0.015;
    this.morphProgress += (this.targetMorph - this.morphProgress) * 0.05;
    
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Desenhar Astro (Sol <-> Lua Morfe)
    this.drawOrb();

    // Desenhar Partículas Magnéticas
    this.drawParticles();

    requestAnimationFrame(() => this.animate());
  }

  drawOrb() {
    const t = this.morphProgress;
    const cx = this.centerX;
    const cy = this.centerY;
    const r = this.radius;

    this.ctx.save();
    
    // Gradiente Dinâmico (Âmbar Solar -> Violeta Lunar)
    const grad = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
    if (t < 0.5) {
      grad.addColorStop(0, '#fff5cc');
      grad.addColorStop(0.5, '#ff9f43');
      grad.addColorStop(1, '#ee5253');
    } else {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#a29bfe');
      grad.addColorStop(1, '#6c5ce7');
    }

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fillStyle = grad;
    this.ctx.fill();

    // Recorte Lua Crescente se t > 0
    if (t > 0.01) {
      const cutoutOffset = r * (2.4 - t * 1.8);
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.beginPath();
      this.ctx.arc(cx + cutoutOffset * 0.6, cy - cutoutOffset * 0.3, r * 0.9, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawParticles() {
    const t = this.morphProgress;
    this.particles.forEach(p => {
      p.angle += p.speed;
      const x = this.centerX + Math.cos(p.angle) * p.dist;
      const y = this.centerY + Math.sin(p.angle) * p.dist;

      const hue = t < 0.5 ? 30 : 240;
      this.ctx.fillStyle = \`hsla(\${hue}, 90%, 70%, \${p.opacity})\`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
}

// Inicializar na Home
window.addEventListener('DOMContentLoaded', () => {
  new SunMoonHeroAnimation('sunMoonCanvas');
});`,

    html: `<!-- ESTRUTURA HTML DA HOME -->
<section class="hero-section">
  <div class="hero-content">
    <h1>Animação Interativa <span class="gradient-text">Sol & Lua</span></h1>
    <p>Inspirada na interface dinamica do ChatGPT.</p>
  </div>

  <!-- Contêiner do Canvas com Efeito Glow -->
  <div class="canvas-stage">
    <canvas id="sunMoonCanvas"></canvas>
  </div>
</section>`,

    css: `/* ESTILOS CSS DA ANIMAÇÃO HERO */
.canvas-stage {
  width: 100%;
  max-width: 800px;
  height: 480px;
  margin: 0 auto;
  position: relative;
  background: rgba(18, 20, 29, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 50px rgba(255, 159, 67, 0.25);
  overflow: hidden;
  cursor: pointer;
}

#sunMoonCanvas {
  width: 100%;
  height: 100%;
  display: block;
}`,

    react: `// COMPONENTE REACT (SunMoonHero.jsx)
import React, { useEffect, useRef, useState } from 'react';

export const SunMoonHero = () => {
  const canvasRef = useRef(null);
  const [isMoon, setIsMoon] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animId;
    let morph = isMoon ? 1 : 0;
    
    const render = () => {
      // Lógica de renderização Canvas 2D
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isMoon]);

  return (
    <div className="canvas-stage" onClick={() => setIsMoon(!isMoon)}>
      <canvas ref={canvasRef} />
    </div>
  );
};`
  };

  // 2. Alternância de Tema Claro / Escuro
  let isDarkMode = true;
  themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeBtnText.textContent = isDarkMode ? 'Modo Escuro' : 'Modo Claro';
  });

  // 3. Atualizar Estado do Morfe (Sol <-> Lua)
  function updateMorphState(val) {
    engine.setTargetMorph(val);
    morphSliderInline.value = val;
    morphPercentage.textContent = `${Math.round(val * 100)}%`;

    if (val < 0.5) {
      btnModeSun.classList.add('active');
      btnModeMoon.classList.remove('active');
      hudMode.textContent = 'Modo: Sol Plasma';
      canvasStage.style.boxShadow = 'var(--shadow-glow-sun)';
      canvasStage.style.borderColor = 'rgba(255, 159, 67, 0.3)';
      ambientGlow.style.background = 'radial-gradient(circle, var(--accent-sun-glow) 0%, rgba(108, 92, 231, 0.15) 50%, transparent 70%)';
    } else {
      btnModeSun.classList.remove('active');
      btnModeMoon.classList.add('active');
      hudMode.textContent = 'Modo: Lua Cósmica';
      canvasStage.style.boxShadow = 'var(--shadow-glow-moon)';
      canvasStage.style.borderColor = 'rgba(108, 92, 231, 0.4)';
      ambientGlow.style.background = 'radial-gradient(circle, var(--accent-moon-glow) 0%, rgba(0, 206, 201, 0.15) 50%, transparent 70%)';
    }
  }

  btnModeSun.addEventListener('click', () => updateMorphState(0));
  btnModeMoon.addEventListener('click', () => updateMorphState(1));
  morphSliderInline.addEventListener('input', (e) => updateMorphState(parseFloat(e.target.value)));

  // Clique no Canvas para alternar rápida
  canvasStage.addEventListener('click', (e) => {
    // Evitar disparar se clicou num botão do HUD
    if (e.target.closest('.hud-action-btn')) return;
    const current = engine.targetMorph;
    updateMorphState(current > 0.5 ? 0 : 1);
  });

  // 4. Parâmetros dos Sliders de Personalização
  paramParticles.addEventListener('input', (e) => {
    const v = e.target.value;
    valParticles.textContent = v;
    engine.setParticleCount(v);
  });

  paramSpeed.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value).toFixed(1);
    valSpeed.textContent = `${v}x`;
    engine.setSpeedMultiplier(v);
  });

  paramGravity.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value).toFixed(1);
    valGravity.textContent = `${v}x`;
    engine.setGravityStrength(v);
  });

  paramGlow.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value).toFixed(1);
    valGlow.textContent = `${v}x`;
    engine.setGlowIntensity(v);
  });

  triggerPulseBtn.addEventListener('click', () => {
    engine.triggerPulse();
  });

  btnResetParams.addEventListener('click', () => {
    paramParticles.value = 120; valParticles.textContent = '120'; engine.setParticleCount(120);
    paramSpeed.value = 1.0; valSpeed.textContent = '1.0x'; engine.setSpeedMultiplier(1.0);
    paramGravity.value = 1.2; valGravity.textContent = '1.2x'; engine.setGravityStrength(1.2);
    paramGlow.value = 1.0; valGlow.textContent = '1.0x'; engine.setGlowIntensity(1.0);
  });

  // 5. Abas de Código & Copiar
  let currentTab = 'js';
  codeSnippet.textContent = codeSnippets.js;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.getAttribute('data-tab');
      codeSnippet.textContent = codeSnippets[currentTab];
    });
  });

  btnCopyCode.addEventListener('click', () => {
    const codeToCopy = codeSnippets[currentTab];
    navigator.clipboard.writeText(codeToCopy).then(() => {
      const copyIcon = btnCopyCode.querySelector('.copy-icon');
      const checkIcon = btnCopyCode.querySelector('.check-icon');

      copyIcon.classList.add('hidden');
      checkIcon.classList.remove('hidden');
      copyBtnLabel.textContent = 'Copiado!';

      setTimeout(() => {
        copyIcon.classList.remove('hidden');
        checkIcon.classList.add('hidden');
        copyBtnLabel.textContent = 'Copiar Código';
      }, 2500);
    }).catch(err => {
      console.error('Erro ao copiar código: ', err);
    });
  });
});
