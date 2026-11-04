import { KARATS, type Karat, type Municipio } from '../data/stores.ts'
import type { Priority } from '../lib/pricing.ts'
import type { Answer, Intent, Piece, Step } from './types.ts'

/**
 * Keyword fallback for free text. Gemini replaces this through the Worker;
 * this keeps the prototype usable offline and is the contract Gemini must match.
 */

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const DONT_KNOW = /\b(no se|ni idea|no lo se|no estoy segur|desconozco|no tengo idea)\b/

const INTENT_WORDS: [Intent, RegExp][] = [
  ['vender', /\b(vend|venta)/],
  ['comprar', /\b(compr)/],
  ['credito', /\b(credito|prestamo|empen|financ)/],
  ['invertir', /\b(invert|inversion|ahorr)/],
  ['digitalizar', /\b(digital|token|cripto)/],
]

const PIECE_WORDS: [Piece, RegExp][] = [
  ['anillos', /\b(anillo|sortija|alianza|cintillo)/],
  ['cadenas', /\b(cadena|collar|gargantilla)/],
  ['pulseras', /\b(pulsera|brazalete|esclava)/],
  ['zarcillos', /\b(zarcillo|arete|pendiente|topito|candonga)/],
  ['otras', /\b(otra|otro|dije|medalla|moneda|reloj|lingote|prendedor|broche)/],
]

const PRIORITY_WORDS: [Priority, RegExp][] = [
  ['cercania', /\b(cerca|cercan|proxim|zona)/],
  ['precio', /\b(precio|pag|plata|dinero|reales|mejor oferta)/],
  ['reputacion', /\b(reput|confi|segur|resen|opinion|serio|recomend)/],
]

const ZONE_WORDS: [Municipio, RegExp][] = [
  ['El Hatillo', /\b(hatillo|lagunita|la boyera|los naranjos|alto hatillo)/],
  ['Chacao', /\b(chacao|altamira|palos grandes|campo alegre|la castellana|el rosal|bello campo|el retiro)/],
  ['Baruta', /\b(baruta|las mercedes|prados del este|la trinidad|santa fe|chuao|el cafetal|san luis|los samanes|caurimare|valle arriba)/],
  ['Sucre', /\b(sucre|petare|dos caminos|la urbina|boleita|los cortijos|terrazas del avila|macaracuay|la california|palo verde)/],
  ['Libertador', /\b(libertador|sabana grande|centro|catia|el paraiso|la candelaria|chacaito|los chaguaramos|la vega|el valle|san bernardino|montalban|caricuao|plaza venezuela|bello monte)/],
]

const YES = /^(si|sip|claro|dale|ok|okay|va|bueno|por supuesto|quiero|me gustaria)\b/
const NO = /^(no|nop|nah|ahorita no|por ahora no|ninguno|nada)\b/

const matches = <T,>(text: string, table: [T, RegExp][]) => table.filter(([, re]) => re.test(text)).map(([v]) => v)

function parseWeight(text: string): number | null | undefined {
  if (DONT_KNOW.test(text)) return null
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(kg|kilo|g|gr|grs|gramo)?/)
  if (!m) {
    if (/\bmedio gramo\b/.test(text)) return 0.5
    return undefined
  }
  let grams = Number(m[1].replace(',', '.'))
  if (m[2] === 'kg' || m[2] === 'kilo') grams *= 1000
  return Number.isFinite(grams) && grams > 0 && grams <= 100000 ? grams : undefined
}

function parseKarat(text: string): Karat | null | undefined {
  if (DONT_KNOW.test(text)) return null
  if (/\boro italiano\b/.test(text)) return 18
  if (/\b(oro puro|oro fino)\b/.test(text)) return 24
  // Prefer a number tagged as karats ("10 gramos de 18k" → 18), then a bare one.
  const m = text.match(/\b(\d{2})\s*(k|kt|kts|quilates?)\b/) ?? text.match(/\b(\d{2})\b/)
  if (!m) return undefined
  const k = Number(m[1]) as Karat
  return KARATS.includes(k) ? k : undefined
}

/** Maps free text to an answer for `step`, or null if it can't. */
export function parseLocally(step: Step, raw: string): Answer | null {
  const text = normalize(raw)
  if (!text) return null
  switch (step) {
    case 'intent': {
      const [intent] = matches(text, INTENT_WORDS)
      return intent ? { step, intent } : null
    }
    case 'sellInstead': {
      if (NO.test(text)) return { step, yes: false }
      if (YES.test(text) || /\bvend/.test(text)) return { step, yes: true }
      return null
    }
    case 'pieces': {
      const pieces = matches(text, PIECE_WORDS)
      return pieces.length ? { step, pieces } : null
    }
    case 'weight': {
      const weight = parseWeight(text)
      return weight === undefined ? null : { step, weight }
    }
    case 'karat': {
      const karat = parseKarat(text)
      return karat === undefined ? null : { step, karat }
    }
    case 'priority': {
      const [priority] = matches(text, PRIORITY_WORDS)
      return priority ? { step, priority } : null
    }
    case 'zone': {
      const [zone] = matches(text, ZONE_WORDS)
      return zone ? { step, zone } : null
    }
    case 'crossSell': {
      if (NO.test(text)) return { step, interests: [] }
      const interests = matches(text, INTENT_WORDS).filter((i) => i !== 'vender')
      return interests.length ? { step, interests } : null
    }
    default:
      return null
  }
}
