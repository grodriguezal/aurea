import type { Karat, Municipio } from '../data/stores.ts'
import type { Priority } from '../lib/pricing.ts'

export type Intent = 'vender' | 'comprar' | 'credito' | 'invertir' | 'digitalizar'
export type Piece = 'anillos' | 'cadenas' | 'pulseras' | 'zarcillos' | 'otras'

export type Step =
  | 'intent'
  /** Picked a not-yet-available intent; offered to sell instead. */
  | 'sellInstead'
  | 'pieces'
  | 'weight'
  | 'karat'
  | 'priority'
  | 'zone'
  | 'options'
  | 'schedule'
  | 'crossSell'
  | 'done'

/** What the user has told us so far. `undefined` = not asked yet, `null` = "no lo sé". */
export interface Draft {
  intent?: Intent
  pieces: Piece[]
  weight?: number | null
  karat?: Karat | null
  priority?: Priority
  zone?: Municipio
  storeId?: string
  slot?: { day: string; time: string }
  /** Intents the user wants to hear about later. */
  interests: Intent[]
}

/** A structured answer to the current step, from a chip/widget or interpreted free text. */
export type Answer =
  | { step: 'intent'; intent: Intent }
  | { step: 'sellInstead'; yes: boolean }
  | { step: 'pieces'; pieces: Piece[] }
  | { step: 'weight'; weight: number | null }
  | { step: 'karat'; karat: Karat | null }
  | { step: 'priority'; priority: Priority }
  | { step: 'zone'; zone: Municipio }
  | { step: 'options'; storeId: string }
  | { step: 'schedule'; day: string; time: string; notified: boolean }
  | { step: 'crossSell'; interests: Intent[] }

export interface BookingSnapshot {
  storeId: string
  day: string
  time: string
  pieces: Piece[]
  weight: number | null
  karat: Karat | null
  /** Whether a WhatsApp confirmation was actually sent. */
  notified: boolean
}

export type Message = { id: string } & (
  | { from: 'bot'; kind: 'text'; text: string }
  | { from: 'user'; kind: 'text'; text: string }
  | { from: 'bot'; kind: 'estimate'; pieces: Piece[]; weight: number | null; karat: Karat | null }
  | { from: 'bot'; kind: 'options'; storeIds: string[]; priority: Priority }
  | { from: 'bot'; kind: 'booking'; booking: BookingSnapshot }
)

export interface ChatState {
  step: Step
  draft: Draft
  messages: Message[]
}
