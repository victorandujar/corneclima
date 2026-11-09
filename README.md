# Corneclima — propuesta web

> **Propuesta de diseño no oficial** preparada por Web Local Growth. No es la web oficial de Corneclima.

| | |
|---|---|
| **Cliente potencial** | Corneclima, S.L. · Avda. Barcelona 17, Sant Joan Despí · 93 375 58 45 · info@corneclima.com · desde el año 2000 |
| **Objetivo** | Sustituir la web actual (WordPress + Divi) por una más rápida, accesible y que enseñe sus trabajos reales |
| **Alcance** | Página única: termostato interactivo, servicios, trabajos paso a paso, reseñas, financiación y contacto; aviso legal y privacidad |
| **Estado** | Demo terminada · `PUBLIC_IS_DEMO=true` |

## Por qué (auditoría de corneclima.com, 09/11/2026)

| | Web actual | Esta propuesta |
|---|---|---|
| Lighthouse móvil | Rendimiento 74 · Accesibilidad 77 · Buenas prácticas 96 · SEO 100 | **99 · 100 · 100 · 100** (con animaciones) |
| LCP móvil | 5,0 s | 0,8 s |

Además, en la web actual:
- Bloquea el zoom en móvil (`user-scalable=0`).
- Hay erratas en la portada: "calefaccicón", "Financiaciópn", "acondiconado".
- El segundo dominio, `instalacionescorneclima.com`, no responde.
- Carga unos 86 KB de CSS que no usa.

## Identidad: "Frío / Calor"

- **Marca:** llama del logotipo vectorizada (`src/assets/brand/`). Cian `#00CCFF` del logo y naranja `#F87A1C` de su exposición de calderas.
- **Escala térmica:** cian, azul, violeta, rosa y naranja, como una cámara térmica. El termostato fija `--temp` y tiñe los acentos de toda la página. `--temp-tinta` es su versión oscura, que cumple el contraste AA para texto.
- **Tipografía:** Barlow Condensed (rótulos y cifras) y Barlow (texto), autoalojadas.

## Funcionalidades

- **Portada oscura con "aire"** (`src/scripts/airflow.ts`):
  - Partículas en canvas que salen del termostato: copos que caen en frío y brasas que suben en calor, con el color de la temperatura. El dial tiene un halo de luz.
  - Se detiene fuera de pantalla, con la pestaña oculta y con `prefers-reduced-motion`.
- **Termostato** (`Hero.astro` + `src/scripts/thermostat.ts`):
  - Se arrastra el mando, se usan los botones ± o el teclado (flechas, Re Pág/Av Pág, Inicio/Fin). Es un `role="slider"` con `aria-valuetext`.
  - Según la temperatura recomienda el servicio adecuado y lo resalta en la página.
  - Al cargar hace un barrido corto para mostrar que se puede girar, salvo con `prefers-reduced-motion`.
- **Banda en movimiento** con datos reales (desde 2000, 4,7★, financiación, municipios). Se pausa al pasar el ratón.
- **Trabajos tipo "stories"** (`Trabajos.astro` + `src/scripts/trabajos.ts`):
  - Mientras la sección está en pantalla, las fases avanzan solas con barra de progreso y luego pasa al siguiente trabajo.
  - Se pausa con el ratón encima y se detiene en cuanto el usuario interactúa.
  - Pestañas ARIA, flechas y deslizamiento en móvil.
- **Entradas al hacer scroll** (`src/scripts/reveal.ts`): textos que suben, fotos que se destapan y tarjetas escalonadas. Sin JS todo es visible; con movimiento reducido no hay animación.
- **Financiación:** el "24" cuenta hacia arriba al aparecer.
- **Reseñas de Google:** citas literales de las que el propio negocio muestra en su web.
- **Contacto:** el formulario valida y prepara el mensaje para WhatsApp o para email. No hay backend.
- **SEO:**
  - JSON-LD `HVACBusiness` con dirección, horario, zona, año de fundación y redes.
  - Sitemap, canonical y Open Graph.
  - En modo demo, `noindex` y `robots.txt` con `Disallow`.

## Recursos

Fotos de su biblioteca de medios pública (corneclima.com): conductos, cassette, oficina, plato de ducha y balcón. Están en `src/assets/trabajos/` y `astro:assets` las optimiza a WebP.

**Derechos:** son de Corneclima. Solo se usan en esta propuesta privada; para publicar hace falta su autorización.

## Pendiente del negocio

- NIF (aviso legal).
- Confirmar que el 684 46 79 06 tiene WhatsApp.
- Más trabajos recientes (su Instagram, @instalaciones_corneclima).
- Validar los textos de servicios.

## Ejecutar y desplegar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build → dist/
```

En Vercel: importar el repo (raíz por defecto, framework Astro) y añadir la variable `PUBLIC_IS_DEMO=true`. Para producción: `PUBLIC_IS_DEMO=false`, `SITE_URL` con su dominio y datos legales completos.
