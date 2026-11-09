/**
 * Termostato de la portada. Arrastrar el mando, usar flechas/Inicio/Fin o los
 * botones ± cambia la temperatura; --t (0 frío … 1 calor) tiñe toda la página
 * y el texto recomienda el servicio adecuado.
 */
const MIN = 16;
const MAX = 30;
const SWEEP = 270; // grados del arco
const START = -135; // ángulo (desde las 12 en punto, horario) de MIN

type Modo = 'frio' | 'confort' | 'calor';

/** Paradas de la escala térmica (mismas que el dial en Hero.astro). */
const STOPS: readonly (readonly [number, number, number])[] = [
  [0x00, 0xcc, 0xff],
  [0x3b, 0x6c, 0xff],
  [0x8a, 0x4d, 0xff],
  [0xe0, 0x45, 0x7b],
  [0xf8, 0x7a, 0x1c],
];
const thermal = (t: number): string => {
  const x = Math.min(0.9999, Math.max(0, t)) * (STOPS.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = STOPS[i]!;
  const b = STOPS[i + 1]!;
  const c = a.map((v, k) => Math.round(v + (b[k]! - v) * f));
  return `rgb(${c.join(' ')})`;
};

const modo = (t: number): Modo => (t <= 20 ? 'frio' : t >= 25 ? 'calor' : 'confort');

const COPY: Record<Modo, { label: string; text: string; href: string; cta: string }> = {
  frio: {
    label: 'Modo frío',
    text: '¿Buscas fresco? Aire acondicionado por split, conductos o cassette, instalado y mantenido por nosotros.',
    href: '#servicio-frio',
    cta: 'Ver aire acondicionado',
  },
  confort: {
    label: 'Confort',
    text: '¿Frío en verano y calor en invierno? Una bomba de calor o aerotermia lo resuelve con un solo sistema.',
    href: '#servicios',
    cta: 'Ver servicios',
  },
  calor: {
    label: 'Modo calor',
    text: '¿Buscas calor? Calderas, radiadores y calefacción: instalación, cambio y mantenimiento.',
    href: '#servicio-calor',
    cta: 'Ver calefacción',
  },
};

export const initThermostat = (root: HTMLElement): void => {
  const knob = root.querySelector<HTMLButtonElement>('[data-knob]');
  const dial = root.querySelector<HTMLElement>('[data-thermo]');
  const tempEl = root.querySelector<HTMLElement>('[data-temp]');
  const labelEl = root.querySelector<HTMLElement>('[data-mode-label]');
  const frio = root.querySelector<HTMLElement>('[data-word="frio"]');
  const calor = root.querySelector<HTMLElement>('[data-word="calor"]');
  const section = root.closest('section');
  const textEl = section?.querySelector<HTMLElement>('[data-mode-text]');
  const linkEl = section?.querySelector<HTMLAnchorElement>('[data-mode-link]');
  if (!knob || !dial || !tempEl || !labelEl) return;

  let temp = Number(knob.getAttribute('aria-valuenow')) || 22;
  let touched = false;

  const radius = (): number => dial.getBoundingClientRect().width / 2 - 11;

  const render = (): void => {
    const t = (temp - MIN) / (MAX - MIN);
    const m = modo(temp);
    document.documentElement.style.setProperty('--t', t.toFixed(3));
    document.documentElement.style.setProperty('--temp', thermal(t));
    knob.style.setProperty('--a', `${START + t * SWEEP}deg`);
    knob.style.setProperty('--r', `${radius()}px`);
    knob.setAttribute('aria-valuenow', String(temp));
    knob.setAttribute('aria-valuetext', `${temp} grados, ${COPY[m].label.toLowerCase()}`);
    tempEl.textContent = String(temp);
    labelEl.textContent = COPY[m].label;
    if (frio) { frio.style.opacity = String(0.25 + 0.75 * (1 - t)); frio.style.transform = `scale(${0.92 + 0.08 * (1 - t)})`; }
    if (calor) { calor.style.opacity = String(0.25 + 0.75 * t); calor.style.transform = `scale(${0.92 + 0.08 * t})`; }
    if (touched && textEl) textEl.textContent = COPY[m].text;
    if (touched && linkEl) { linkEl.href = COPY[m].href; linkEl.textContent = COPY[m].cta; }
    document.querySelectorAll<HTMLElement>('[data-servicio]').forEach((el) => {
      el.toggleAttribute('data-activo', touched && el.dataset.servicio === (m === 'confort' ? '' : m));
    });
  };

  const set = (value: number, fromUser = true): void => {
    temp = Math.round(Math.min(MAX, Math.max(MIN, value)));
    if (fromUser) touched = true;
    render();
  };

  // Arrastre
  const fromPointer = (e: PointerEvent): void => {
    const r = dial.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    let deg = (Math.atan2(x, -y) * 180) / Math.PI; // 0 = arriba, horario
    if (deg < START) deg += 360;
    const t = Math.min(1, Math.max(0, (deg - START) / SWEEP));
    set(MIN + t * (MAX - MIN));
  };
  let dragging = false;
  const onDown = (e: PointerEvent): void => {
    dragging = true;
    knob.setPointerCapture?.(e.pointerId);
    knob.focus({ preventScroll: true });
    fromPointer(e);
  };
  knob.addEventListener('pointerdown', onDown);
  dial.addEventListener('pointerdown', (e) => {
    if (e.target instanceof HTMLButtonElement && e.target !== knob) return;
    onDown(e);
  });
  window.addEventListener('pointermove', (e) => dragging && fromPointer(e));
  window.addEventListener('pointerup', () => (dragging = false));

  // Teclado (patrón ARIA slider)
  knob.addEventListener('keydown', (e) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 3, PageDown: -3 };
    if (e.key in map) set(temp + (map[e.key] ?? 0));
    else if (e.key === 'Home') set(MIN);
    else if (e.key === 'End') set(MAX);
    else return;
    e.preventDefault();
  });

  root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) =>
    b.addEventListener('click', () => set(temp + Number(b.dataset.step))),
  );

  window.addEventListener('resize', render);
  render();

  // Pista de que se puede girar: un barrido corto la primera vez (sin movimiento reducido).
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const seq = [21, 20, 19, 18, 19, 20, 21, 22, 23, 24, 25, 26, 25, 24, 23, 22];
    let i = 0;
    const tick = (): void => {
      if (touched || i >= seq.length) return;
      set(seq[i++] ?? 22, false);
      window.setTimeout(tick, 70);
    };
    window.setTimeout(tick, 900);
  }
};
