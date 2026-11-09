/** Pestañas de trabajos (patrón ARIA tabs) + visor de fases con teclado y deslizamiento. */
export const initTrabajos = (root: HTMLElement): void => {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];

  const selectTab = (i: number, focus = false): void => {
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach((p, k) => (p.hidden = k !== i));
    if (focus) tabs[i]?.focus();
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(i));
    t.addEventListener('keydown', (e) => {
      const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (dir === undefined) return;
      e.preventDefault();
      selectTab((i + dir + tabs.length) % tabs.length, true);
    });
  });

  for (const panel of panels) {
    const fotos = [...panel.querySelectorAll<HTMLElement>('[data-foto]')];
    const pasos = [...panel.querySelectorAll<HTMLButtonElement>('[data-paso]')];
    const fase = panel.querySelector<HTMLElement>('[data-fase]');
    let current = 0;

    const show = (j: number): void => {
      current = (j + fotos.length) % fotos.length;
      fotos.forEach((f, k) => {
        f.classList.toggle('opacity-100', k === current);
        f.classList.toggle('opacity-0', k !== current);
      });
      pasos.forEach((p, k) => p.setAttribute('aria-pressed', String(k === current)));
      if (fase) fase.textContent = pasos[current]?.dataset.label ?? '';
    };

    pasos.forEach((p, j) => {
      p.addEventListener('click', () => show(j));
      p.addEventListener('mouseenter', () => show(j));
    });
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { show(current + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { show(current - 1); e.preventDefault(); }
    });

    // Deslizar en móvil
    let x0: number | null = null;
    panel.addEventListener('pointerdown', (e) => (x0 = e.clientX));
    panel.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    });
  }
};
