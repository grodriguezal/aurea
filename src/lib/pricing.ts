import { NEIGHBORS, type Karat, type Municipio, type Store } from '../data/stores.ts'
import { dateKey, fromMinutes, keyDate, toMinutes } from './dates.ts'
import { TROY_OZ_GRAMS } from './goldPrice.ts'

/** Karats assumed when the user doesn't know theirs: the most common in Venezuela. */
export const UNKNOWN_KARAT_RANGE: Karat[] = [10, 14, 18]

/** USD the store would pay per gram of the given karat; null if it can't be priced (no spot price, or karat not bought). */
export function pricePerGram(store: Store, karat: Karat, spot: number | null): number | null {
  if (store.pricing.kind === 'perGram') return store.pricing.usd[karat] ?? null
  if (spot === null) return null
  return (spot / TROY_OZ_GRAMS) * (karat / 24) * store.pricing.percent
}

export interface Estimate {
  low: number
  high: number
  /** True when no weight was given and the figures are per gram. */
  perGram: boolean
}

/** Offer range for one store; a range only when the karat is unknown. */
export function storeEstimate(store: Store, weight: number | null, karat: Karat | null, spot: number | null): Estimate | null {
  const prices = (karat ? [karat] : UNKNOWN_KARAT_RANGE).map((k) => pricePerGram(store, k, spot)).filter((p): p is number => p !== null)
  if (prices.length === 0) return null
  const grams = weight ?? 1
  return { low: Math.min(...prices) * grams, high: Math.max(...prices) * grams, perGram: weight === null }
}

/** Range across several stores. */
export function marketEstimate(stores: Store[], weight: number | null, karat: Karat | null, spot: number | null): Estimate | null {
  const all = stores.map((s) => storeEstimate(s, weight, karat, spot)).filter((e): e is Estimate => e !== null)
  if (all.length === 0) return null
  return { low: Math.min(...all.map((e) => e.low)), high: Math.max(...all.map((e) => e.high)), perGram: weight === null }
}

export type Priority = 'cercania' | 'precio' | 'reputacion'

/** Rating pulled towards 4.5 when there are few reviews, so 5★ from 3 people doesn't beat 4.8★ from 200. */
const trustScore = (s: Store) => (s.rating * s.reviews + 4.5 * 20) / (s.reviews + 20)

function distance(store: Store, zone: Municipio | undefined) {
  if (!zone) return 0
  return store.municipio === zone ? 0 : NEIGHBORS[zone].indexOf(store.municipio) + 1
}

/** Best stores first for the user's priority. */
export function rankStores(stores: Store[], priority: Priority, opts: { zone?: Municipio; karat: Karat | null; spot: number | null }, limit = 3): Store[] {
  const k = opts.karat ?? 14
  const price = (s: Store) => pricePerGram(s, k, opts.spot) ?? 0
  const sorted = [...stores].sort((a, b) => {
    if (priority === 'cercania') return distance(a, opts.zone) - distance(b, opts.zone) || price(b) - price(a)
    if (priority === 'reputacion') return trustScore(b) - trustScore(a) || price(b) - price(a)
    return price(b) - price(a) || trustScore(b) - trustScore(a)
  })
  return sorted.slice(0, limit)
}

/** Length of an appointment; slots start this far apart and the last one ends by closing time. */
const SLOT_MINUTES = 60
/** Earliest a same-day appointment can start, from now. */
const SAME_DAY_LEAD_MINUTES = 90

/** Bookable start times for a store on a date key. */
export function storeSlots(store: Store, key: string, now = new Date()): string[] {
  const date = keyDate(key)
  const hours = store.hours[date.getDay() as 0]
  if (!hours) return []
  const open = toMinutes(hours[0])
  const close = toMinutes(hours[1])
  const earliest = key === dateKey(now) ? now.getHours() * 60 + now.getMinutes() + SAME_DAY_LEAD_MINUTES : 0
  const slots: string[] = []
  for (let t = open; t + SLOT_MINUTES <= close; t += SLOT_MINUTES) if (t >= earliest) slots.push(fromMinutes(t))
  return slots
}
