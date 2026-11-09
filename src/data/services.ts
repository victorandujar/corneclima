import type { ImageMetadata } from 'astro';
import split from '../assets/trabajos/split.jpg';
import calderas from '../assets/trabajos/calderas-exposicion.webp';
import obra from '../assets/trabajos/ducha-obra-1.jpg';

export type Modo = 'frio' | 'calor' | 'obra';

export interface Service {
  readonly id: Modo;
  readonly kicker: string;
  readonly title: string;
  readonly lead: string;
  readonly items: readonly string[];
  readonly img: ImageMetadata;
  readonly alt: string;
}

/** Servicios tal como los describe corneclima.com. */
export const services: readonly Service[] = [
  {
    id: 'frio',
    kicker: 'Frío',
    title: 'Aire acondicionado',
    lead: 'Doméstico e industrial: instalación, reparación y mantenimiento.',
    items: ['Splits de pared', 'Conductos con fabricación propia', 'Cassette para locales y oficinas', 'Limpieza y mantenimiento'],
    img: split,
    alt: 'Split de aire acondicionado instalado en una pared blanca',
  },
  {
    id: 'calor',
    kicker: 'Calor',
    title: 'Calderas y calefacción',
    lead: 'Instalación y mantenimiento de calderas y sistemas de calefacción.',
    items: ['Calderas de gas', 'Radiadores y toalleros', 'Aerotermia', 'Cambio de calentadores y termos'],
    img: calderas,
    alt: 'Exposición de calderas y radiadores de Corneclima frente a una pared naranja',
  },
  {
    id: 'obra',
    kicker: 'Obra',
    title: 'Obras y reformas integrales',
    lead: 'Llave en mano: un solo equipo coordina todos los oficios.',
    items: ['Albañilería y pladur', 'Electricidad, fontanería y gas', 'Falsos techos y parquet', 'Carpintería, metalistería y pintura'],
    img: obra,
    alt: 'Dos operarios con camiseta de Corneclima trabajando en la reforma de un baño',
  },
];
