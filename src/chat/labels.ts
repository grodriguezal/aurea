import { KARATS, MUNICIPIOS, type Karat, type Municipio } from '../data/stores.ts'
import { number } from '../lib/format.ts'
import type { Priority } from '../lib/pricing.ts'
import type { Intent, Piece } from './types.ts'

export interface Option<T> {
  value: T
  label: string
  /** Shown as a small "Pronto" badge. */
  soon?: boolean
}

export const INTENTS: Option<Intent>[] = [
  { value: 'vender', label: 'Vender' },
  { value: 'comprar', label: 'Comprar' },
  { value: 'credito', label: 'Obtener un crédito' },
  { value: 'invertir', label: 'Invertir', soon: true },
  { value: 'digitalizar', label: 'Digitalizar', soon: true },
]
/** Lower-case noun phrase for sentences ("te avisaremos cuando … esté disponible"). */
export const INTENT_PHRASE: Record<Intent, string> = {
  vender: 'la venta',
  comprar: 'la compra de oro',
  credito: 'el crédito con tu oro',
  invertir: 'la inversión en oro',
  digitalizar: 'la digitalización de tu oro',
}

export const PIECES: Option<Piece>[] = [
  { value: 'anillos', label: 'Anillos' },
  { value: 'cadenas', label: 'Cadenas' },
  { value: 'pulseras', label: 'Pulseras' },
  { value: 'zarcillos', label: 'Zarcillos' },
  { value: 'otras', label: 'Otras piezas' },
]

export const KARAT_OPTIONS: Option<Karat | null>[] = [
  ...KARATS.map((k) => ({ value: k, label: `${k}k` })),
  { value: null, label: 'No lo sé, ¡no pasa nada!' },
]

export const PRIORITIES: Option<Priority>[] = [
  { value: 'cercania', label: 'Cercanía' },
  { value: 'precio', label: 'Mejor precio' },
  { value: 'reputacion', label: 'Reputación de la tienda' },
]
/** Tag on the top-ranked store for each priority. */
export const PRIORITY_TAG: Record<Priority, string> = {
  cercania: 'Más cerca',
  precio: 'Mejor precio',
  reputacion: 'Mejor valorada',
}

export const ZONES: Option<Municipio>[] = MUNICIPIOS.map((m) => ({ value: m, label: m }))

export const labelOf = <T,>(options: Option<T>[], value: T) => options.find((o) => o.value === value)?.label ?? String(value)

export const listJoin = (items: string[]) => new Intl.ListFormat('es', { type: 'conjunction' }).format(items)

/** One piece type picked (and not "otras"): the conversation names it; otherwise it says "piezas". */
export const namedPiece = (pieces: Piece[]): Piece | null => (pieces.length === 1 && pieces[0] !== 'otras' ? pieces[0] : null)

/** "tus anillos", or "tus piezas" when several types (or "otras") were picked. */
export const yourPieces = (pieces: Piece[]) => `tus ${namedPiece(pieces) ?? 'piezas'}`

/** Object pronoun that agrees with `yourPieces`: "los" for anillos/zarcillos, "las" otherwise. */
export const piecesPronoun = (pieces: Piece[]) => (['anillos', 'zarcillos'].includes(namedPiece(pieces) ?? '') ? 'los' : 'las')

export const piecesPhrase = (pieces: Piece[]) => listJoin(pieces.map((p) => labelOf(PIECES, p).toLowerCase()))

/** "anillos y cadenas · 12 g · 18k", with placeholders for unknowns. */
export function itemSummary(pieces: Piece[], weight: number | null, karat: Karat | null) {
  return [piecesPhrase(pieces), weight ? `${number.format(weight)} g` : 'peso por confirmar', karat ? `${karat}k` : 'quilates por confirmar'].join(' · ')
}
