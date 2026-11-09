/**
 * Trabajos: pestañas ARIA + visor de fases tipo "stories".
 * Mientras la sección está en pantalla las fases avanzan solas (barra de progreso)
 * y al terminar pasa al siguiente trabajo. Se detiene para siempre en cuanto el
 * usuario interactúa, y se pausa con el ratón encima. Sin autoplay con movimiento reducido.
 */
const STEP_MS = 3200;

export const initTrabajos = (root: HTMLElement): void => {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let tab = 0;
  let step = 0;
  let auto = !reduced;
  let visible = false;
  let hover = false;
  let elapsed = 0;
  let last = 0;
  let raf = 0;

  const fotos = (i: number): HTMLElement[] => [...(panels[i]?.querySelectorAll<HTMLElement>('[data-foto]') ?? [])];
  const pasos = (i: number): HTMLButtonElement[] => [...(panels[i]?.querySelectorAll<HTMLButtonElement>('[data-paso]') ?? [])];

  const paintFills = (progress: number): void => {
    pasos(tab).forEach((p, k) => {
      const fill = p.querySelector<HTMLElement>('[data-fill]');
      if (fill) fill.style.transform = `scaleX(${k < step ? 1 : k === step ? progress : 0})`;
    });
  };

  const show = (j: number): void => {
    const fs = fotos(tab);
    step = (j + fs.length) % fs.length;
    fs.forEach((f, k) => {
      f.classList.toggle('opacity-100', k === step);
      f.classList.toggle('opacity-0', k !== step);
      f.classList.toggle('scale-100', k === step);
      f.classList.toggle('scale-105', k !== step);
    });
    pasos(tab).forEach((p, k) => p.setAttribute('aria-pressed', String(k === step)));
    const fase = panels[tab]?.querySelector<HTMLElement>('[data-fase]');
    if (fase) fase.textContent = pasos(tab)[step]?.dataset.label ?? '';
    elapsed = 0;
    paintFills(auto ? 0 : 1);
  };

  const selectTab = (i: number, focus = false): void => {
    tab = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === tab));
      t.tabIndex = k === tab ? 0 : -1;
    });
    panels.forEach((p, k) => (p.hidden = k !== tab));
    if (focus) tabs[tab]?.focus();
    show(0);
  };

  const stopAuto = (): void => {
    if (!auto) return;
    auto = false;
    cancelAnimationFrame(raf);
    paintFills(1);
  };

  const tick = (now: number): void => {
    if (!auto) return;
    const dt = last ? now - last : 0;
    last = now;
    if (visible && !hover && document.visibilityState === 'visible') {
      elapsed += dt;
      const p = Math.min(1, elapsed / STEP_MS);
      paintFills(p);
      if (p >= 1) {
        if (step + 1 < fotos(tab).length) show(step + 1);
        else selectTab(tab + 1);
      }
    }
    raf = requestAnimationFrame(tick);
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { stopAuto(); selectTab(i); });
    t.addEventListener('keydown', (e) => {
      const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (dir === undefined) return;
      e.preventDefault();
      stopAuto();
      selectTab(tab + dir, true);
    });
  });

  panels.forEach((panel, i) => {
    pasos(i).forEach((p, j) => p.addEventListener('click', () => { stopAuto(); show(j); }));
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { stopAuto(); show(step + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { stopAuto(); show(step - 1); e.preventDefault(); }
    });
    let x0: number | null = null;
    panel.addEventListener('pointerdown', (e) => (x0 = e.clientX));
    panel.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) { stopAuto(); show(step + (dx < 0 ? 1 : -1)); }
    });
    const stage = panel.querySelector('[data-stage]');
    stage?.addEventListener('pointerenter', () => (hover = true));
    stage?.addEventListener('pointerleave', () => (hover = false));
  });

  new IntersectionObserver(([e]) => (visible = Boolean(e?.isIntersecting)), { threshold: 0.4 }).observe(root);
  show(0);
  if (auto) raf = requestAnimationFrame(tick);
};
