/** Reseñas de Google que el propio negocio muestra en su web (fecha de publicación incluida). */
export interface Review { author: string; date: string; text: string; tema: 'frio' | 'calor' | 'obra' }
export const reviews: readonly Review[] = [
  { author: 'Manel Estrade', date: '2026-05-06', tema: 'frio', text: 'Me instalaron el aire acondicionado en una mañana, es por conductos […] Montaron las lamas se llevaron la máquina vieja y recogieron la casa. Un trabajo excelente' },
  { author: 'Roser Isbert', date: '2026-05-05', tema: 'obra', text: 'Hemos hecho la obra del piso (aerotermia, instalación electrica, suelos, actualización de baños y cocina...) con Corneclima y estamos muy contentos! Grandes profesionales quienes saben aconsejarte.' },
  { author: 'Maribel M', date: '2026-04-29', tema: 'frio', text: 'Una limpieza del aire acondicionado a conciencia como si el aparato fuera suyo […] Parecen nuevos, y enfrían una barbaridad.' },
];
