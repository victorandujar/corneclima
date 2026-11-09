/** Datos publicados por el propio negocio en corneclima.com (aviso legal, pie y contacto). */
export const business = {
  name: 'Corneclima',
  legalName: 'Corneclima, S.L.',
  tagline: 'Obres, reformes i instal·lacions integrals',
  since: 2000,
  street: 'Avda. Barcelona, 17',
  postalCode: '08970',
  city: 'Sant Joan Despí',
  region: 'Barcelona',
  phones: [
    { display: '93 375 58 45', e164: '+34933755845' },
    { display: '684 46 79 06', e164: '+34684467906' },
  ],
  /** Móvil usado para WhatsApp: pendiente de confirmar con el negocio. */
  whatsapp: '34684467906',
  email: 'info@corneclima.com',
  hours: [
    { days: 'Lunes a jueves', time: '9:00–13:30 · 17:00–20:00' },
    { days: 'Viernes', time: '9:00–20:00' },
    { days: 'Sábados', time: 'Con cita' },
  ],
  areaServed: ['Sant Joan Despí', 'Cornellà de Llobregat', 'Esplugues de Llobregat', 'Sant Feliu de Llobregat', 'Gavà', 'Castelldefels', 'Barcelona'],
  instagram: 'https://www.instagram.com/instalaciones_corneclima/',
  facebook: 'https://www.facebook.com/Instalaciones-Corneclima-249853799287340',
  google: { rating: 4.7, count: 75 },
} as const;

export const telUrl = (e164: string): string => `tel:${e164}`;
export const whatsappUrl = (text?: string): string =>
  `https://wa.me/${business.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
