export interface Jeweler {
  name: string
  area: string
  rating: string
  reviews: number
  /** share of the metal's theoretical value offered (illustrative) */
  percent: number
  desc: string
  tag: string
}

/** Example establishments: names, ratings, reviews and rates are illustrative, not real offers. */
export const JEWELERS: Jeweler[] = [
  { name: 'Joyería Aurora', area: 'Las Mercedes · ubicación ilustrativa', rating: '4,9', reviews: 82, percent: 0.7, desc: 'Atención personalizada y explicación de cada paso.', tag: 'Mayor referencia' },
  { name: 'Joyería Lúmina', area: 'Altamira · ubicación ilustrativa', rating: '4,8', reviews: 64, percent: 0.68, desc: 'Un proceso tranquilo, transparente y a tu ritmo.', tag: 'A tu ritmo' },
  { name: 'Joyería Brillo', area: 'Chacao · ubicación ilustrativa', rating: '4,7', reviews: 106, percent: 0.66, desc: 'Especialistas en revisión presencial de joyas.', tag: 'Atención cercana' },
]
