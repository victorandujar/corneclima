/**
 * Añade .is-in a los [data-reveal] cuando entran en pantalla (una sola vez).
 * Los de tipo "clip" empiezan recortados al 100 % (área visible 0), así que se
 * observa su contenedor; varios elementos pueden compartir contenedor.
 */
const targets = new Map<Element, HTMLElement[]>();
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      for (const el of targets.get(e.target) ?? []) {
        el.classList.add('is-in');
        el.dispatchEvent(new CustomEvent('reveal'));
      }
      io.unobserve(e.target);
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
);
document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
  const watch = el.dataset.reveal === 'clip' && el.parentElement ? el.parentElement : el;
  const list = targets.get(watch) ?? [];
  list.push(el);
  targets.set(watch, list);
  io.observe(watch);
});
