import type { ImageMetadata } from 'astro';
import ct1 from '../assets/trabajos/conductos-taller-1.webp';
import ct2 from '../assets/trabajos/conductos-taller-2.webp';
import cte1 from '../assets/trabajos/conductos-techo-1.webp';
import cte2 from '../assets/trabajos/conductos-techo-2.webp';
import cte3 from '../assets/trabajos/conductos-techo-3.webp';
import ca1 from '../assets/trabajos/cassette-montaje.webp';
import ca2 from '../assets/trabajos/cassette-techo-1.webp';
import ca3 from '../assets/trabajos/cassette-techo-2.webp';
import ca4 from '../assets/trabajos/cassette-exterior.webp';
import of1 from '../assets/trabajos/oficina-obra-1.jpg';
import of2 from '../assets/trabajos/oficina-obra-2.jpg';
import of3 from '../assets/trabajos/oficina-terminada-1.jpg';
import of4 from '../assets/trabajos/oficina-terminada-2.jpg';
import du1 from '../assets/trabajos/ducha-antes.jpg';
import du2 from '../assets/trabajos/ducha-obra-1.jpg';
import du3 from '../assets/trabajos/ducha-obra-2.jpg';
import du4 from '../assets/trabajos/ducha-terminada-2.jpg';
import ba1 from '../assets/trabajos/balcon-1.webp';
import ba2 from '../assets/trabajos/tarima-1.webp';
import ba3 from '../assets/trabajos/tarima-2.webp';
import type { Modo } from './services';

export interface Paso { readonly label: string; readonly img: ImageMetadata; readonly alt: string }
export interface Trabajo {
  readonly id: string;
  readonly modo: Modo;
  readonly title: string;
  readonly lugar?: string;
  readonly text: string;
  readonly pasos: readonly Paso[];
}

/** Trabajos publicados en corneclima.com (fotos de su biblioteca de medios). */
export const trabajos: readonly Trabajo[] = [
  {
    id: 'conductos-vivienda',
    modo: 'frio',
    title: 'Aire por conductos en vivienda',
    lugar: 'Sant Joan Despí',
    text: 'Conductos fabricados a medida y montados sobre el falso techo del pasillo para climatizar toda la casa.',
    pasos: [
      { label: 'Fabricación', img: ct1, alt: 'Conductos de aire acondicionado fabricados a medida antes del montaje' },
      { label: 'Fabricación', img: ct2, alt: 'Piezas de conducto y máquina preparadas para la instalación' },
      { label: 'Montaje', img: cte1, alt: 'Conducto colgado del techo del pasillo durante la instalación' },
      { label: 'Montaje', img: cte2, alt: 'Red de conductos aislados instalada en el techo' },
      { label: 'Montaje', img: cte3, alt: 'Conducto con aislamiento listo para cerrar el falso techo' },
    ],
  },
  {
    id: 'cassette-local',
    modo: 'frio',
    title: 'Aire por cassette en local',
    text: 'Equipos de cassette integrados en el falso techo registrable y unidades exteriores en fachada.',
    pasos: [
      { label: 'Montaje', img: ca1, alt: 'Técnico instalando un aparato de aire acondicionado de cassette en el techo' },
      { label: 'Terminado', img: ca2, alt: 'Cassette de aire acondicionado integrado en el falso techo de un local' },
      { label: 'Terminado', img: ca3, alt: 'Local con cassette de aire acondicionado y luminarias en el techo' },
      { label: 'Exterior', img: ca4, alt: 'Unidades exteriores de aire acondicionado instaladas en la fachada' },
    ],
  },
  {
    id: 'oficina',
    modo: 'obra',
    title: 'Oficina con climatización por conductos',
    text: 'Techo abierto para las instalaciones, conductos vistos y techo terminado con iluminación integrada.',
    pasos: [
      { label: 'Obra', img: of1, alt: 'Oficina en obra con andamios y conductos de climatización en el techo' },
      { label: 'Obra', img: of2, alt: 'Instalación de conductos en el techo de una oficina' },
      { label: 'Terminado', img: of3, alt: 'Oficina terminada con falso techo e iluminación lineal' },
      { label: 'Terminado', img: of4, alt: 'Detalle de conducto y luminaria en la oficina terminada' },
    ],
  },
  {
    id: 'ducha',
    modo: 'obra',
    title: 'De cabina de hidromasaje a plato de ducha',
    text: 'Se retira la cabina, se rehacen paredes y desagüe, y se coloca un plato de ducha con columna termostática.',
    pasos: [
      { label: 'Antes', img: du1, alt: 'Baño antes de la reforma con cabina de hidromasaje' },
      { label: 'Obra', img: du2, alt: 'Operarios de Corneclima trabajando en la reforma del baño' },
      { label: 'Obra', img: du3, alt: 'Plato de ducha nuevo colocado antes de alicatar' },
      { label: 'Terminado', img: du4, alt: 'Ducha terminada con plato blanco y columna de ducha' },
    ],
  },
  {
    id: 'balcon',
    modo: 'obra',
    title: 'Balcón con tarima',
    text: 'Reforma de balcón y tarima flotante para exterior.',
    pasos: [
      { label: 'Obra', img: ba1, alt: 'Balcón durante la reforma' },
      { label: 'Terminado', img: ba2, alt: 'Balcón con tarima flotante de exterior' },
      { label: 'Terminado', img: ba3, alt: 'Detalle de la tarima del balcón terminada' },
    ],
  },
];
