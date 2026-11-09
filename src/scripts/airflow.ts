/**
 * Partículas de "aire" que salen del termostato. Frío: copos que caen y se
 * alejan; calor: brasas que suben ondulando. Lee --t y --temp de :root.
 * Se detiene fuera de pantalla y con prefers-reduced-motion.
 */
interface P { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; seed: number }

export const initAirflow = (canvas: HTMLCanvasElement, dial: HTMLElement): void => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const root = document.documentElement;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, cx = 0, cy = 0, R = 0;
  const parts: P[] = [];
  const MAX = window.innerWidth < 640 ? 70 : 140;
  let running = false;
  let raf = 0;

  const resize = (): void => {
    const r = canvas.getBoundingClientRect();
    const d = dial.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = d.left - r.left + d.width / 2; cy = d.top - r.top + d.height / 2; R = d.width / 2;
  };

  const spawn = (t: number): P => {
    const a = Math.random() * Math.PI * 2;
    const sp = 0.4 + Math.random() * 0.9;
    return {
      x: cx + Math.cos(a) * R * 0.98,
      y: cy + Math.sin(a) * R * 0.98,
      vx: Math.cos(a) * sp * (1.1 - t * 0.6),
      vy: Math.sin(a) * sp * (1.1 - t * 0.6),
      life: 0,
      max: 140 + Math.random() * 160,
      size: 1 + Math.random() * 2.2,
      seed: Math.random() * 1000,
    };
  };

  const frame = (): void => {
    if (!running) return;
    // Valores en línea que fija el termostato (sin recalcular estilos en cada fotograma).
    const t = Number(root.style.getPropertyValue('--t')) || 0.43;
    const color = root.style.getPropertyValue('--temp') || '#6a5cff';
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    const rate = 2 + Math.abs(t - 0.45) * 6; // más partículas en los extremos
    for (let k = 0; k < rate && parts.length < MAX; k++) parts.push(spawn(t));

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]!;
      p.life++;
      // frío: gravedad hacia abajo y algo de deriva; calor: flota hacia arriba ondulando
      const g = (0.45 - t) * 0.045;
      p.vy += g;
      p.vx += Math.sin((p.life + p.seed) * 0.05) * 0.02 * t;
      p.vx *= 0.995; p.vy *= 0.995;
      p.x += p.vx; p.y += p.vy;
      const k = 1 - p.life / p.max;
      if (k <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, k * 1.4) * 0.75;
      ctx.strokeStyle = color; ctx.fillStyle = color;
      if (t < 0.45) {
        // copo/estela fría: trazo corto en la dirección del movimiento
        ctx.lineWidth = p.size * 0.8;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 6, p.y - p.vy * 6); ctx.stroke();
      } else {
        // brasa: punto con brillo
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (0.6 + k * 0.6), 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver(([e]) => {
    running = Boolean(e?.isIntersecting);
    cancelAnimationFrame(raf);
    if (running) { resize(); raf = requestAnimationFrame(frame); }
  });
  io.observe(canvas);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
    cancelAnimationFrame(raf);
    if (running) raf = requestAnimationFrame(frame);
  });
};
