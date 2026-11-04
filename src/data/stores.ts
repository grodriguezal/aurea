export const KARATS = [10, 14, 18, 21, 22, 24] as const
export type Karat = (typeof KARATS)[number]

export const MUNICIPIOS = ['Libertador', 'Chacao', 'Baruta', 'Sucre', 'El Hatillo'] as const
export type Municipio = (typeof MUNICIPIOS)[number]

/** Other municipios, nearest first; drives the "cercanía" ranking. */
export const NEIGHBORS: Record<Municipio, Municipio[]> = {
  Libertador: ['Chacao', 'Baruta', 'Sucre', 'El Hatillo'],
  Chacao: ['Baruta', 'Sucre', 'Libertador', 'El Hatillo'],
  Baruta: ['Chacao', 'El Hatillo', 'Sucre', 'Libertador'],
  Sucre: ['Chacao', 'Baruta', 'El Hatillo', 'Libertador'],
  'El Hatillo': ['Baruta', 'Sucre', 'Chacao', 'Libertador'],
}

/** Day of week (0 = domingo … 6 = sábado) → [apertura, cierre] in 24h "HH:MM". Missing days are closed. */
export type OpeningHours = Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, [string, string]>>

export type StorePricing =
  /** Pays a share of the metal's spot value (0.7 = 70 %). */
  | { kind: 'percent'; percent: number }
  /** Pays a fixed USD amount per gram for each karat it buys. */
  | { kind: 'perGram'; usd: Partial<Record<Karat, number>> }

export interface Store {
  id: string
  name: string
  address: string
  municipio: Municipio
  /** Google Maps link; omitted for example stores. */
  mapsUrl?: string
  hours: OpeningHours
  pricing: StorePricing
  rating: number
  reviews: number
  description: string
  /** Illustrative store, not a real offer. */
  example?: boolean
}

const WEEKDAYS_9_TO_5: OpeningHours = { 1: ['09:00', '17:00'], 2: ['09:00', '17:00'], 3: ['09:00', '17:00'], 4: ['09:00', '17:00'], 5: ['09:00', '17:00'], 6: ['09:00', '13:00'] }

/** Placeholder catalogue until the partner list is loaded. */
export const STORES: Store[] = [
  {
    id: 'aurora',
    name: 'Joyería Aurora',
    address: 'Las Mercedes',
    municipio: 'Baruta',
    hours: WEEKDAYS_9_TO_5,
    pricing: { kind: 'percent', percent: 0.7 },
    rating: 4.9,
    reviews: 82,
    description: 'Atención personalizada y explicación de cada paso.',
    example: true,
  },
  {
    id: 'lumina',
    name: 'Joyería Lúmina',
    address: 'Altamira',
    municipio: 'Chacao',
    hours: { ...WEEKDAYS_9_TO_5, 6: ['10:00', '14:00'] },
    pricing: { kind: 'percent', percent: 0.68 },
    rating: 4.8,
    reviews: 64,
    description: 'Un proceso tranquilo, transparente y a tu ritmo.',
    example: true,
  },
  {
    id: 'brillo',
    name: 'Joyería Brillo',
    address: 'Chacao centro',
    municipio: 'Chacao',
    hours: { 1: ['10:00', '18:00'], 2: ['10:00', '18:00'], 3: ['10:00', '18:00'], 4: ['10:00', '18:00'], 5: ['10:00', '18:00'] },
    pricing: { kind: 'percent', percent: 0.66 },
    rating: 4.7,
    reviews: 106,
    description: 'Especialistas en revisión presencial de joyas.',
    example: true,
  },
  {
    id: 'dorada',
    name: 'Casa Dorada',
    address: 'Sabana Grande',
    municipio: 'Libertador',
    hours: WEEKDAYS_9_TO_5,
    pricing: { kind: 'percent', percent: 0.72 },
    rating: 4.5,
    reviews: 31,
    description: 'Compra directa con pesaje frente a ti.',
    example: true,
  },
]

export const storeById = (id: string) => STORES.find((s) => s.id === id)
