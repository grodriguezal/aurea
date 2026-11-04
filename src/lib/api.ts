import { parseLocally } from '../chat/parse.ts'
import type { Answer, BookingSnapshot, Draft, Intent, Step } from '../chat/types.ts'

/**
 * Everything the browser needs from the backend. With VITE_API_URL unset the
 * app runs on the in-browser mock; set it to the Cloudflare Worker's URL to go live.
 *
 * Worker contract (JSON in, JSON out, `Authorization: Bearer <token>` after sign-in):
 *   POST /auth/code         { phone }                    → 204          sends a WhatsApp code
 *   POST /auth/verify       { phone, code }              → Session      creates the account on first sign-in
 *   POST /chat/interpret    { step, text, draft }        → { answer: Answer | null }   Gemini, structured output
 *   POST /appointments      { booking }                  → { notified: boolean }       stores it, sends the WhatsApp template
 *   POST /interests         { intents }                  → 204
 */

export interface User {
  id: string
  /** E.164, e.g. +584141234567 */
  phone: string
}

export interface Session {
  token: string
  user: User
}

export type NewBooking = Omit<BookingSnapshot, 'notified'>

export interface Api {
  /** True when running against the in-browser mock. */
  mock: boolean
  requestCode(phone: string): Promise<void>
  verifyCode(phone: string, code: string): Promise<Session>
  interpret(session: Session, step: Step, text: string, draft: Draft): Promise<Answer | null>
  book(session: Session, booking: NewBooking): Promise<{ notified: boolean }>
  saveInterests(session: Session, intents: Intent[]): Promise<void>
}

export class ApiError extends Error {}

/** Code accepted by the mock sign-in. */
export const MOCK_CODE = '123456'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

const mockApi: Api = {
  mock: true,
  async requestCode() {
    await wait(600)
  },
  async verifyCode(phone, code) {
    await wait(500)
    if (code !== MOCK_CODE) throw new ApiError('Ese código no es correcto. Revísalo e inténtalo de nuevo.')
    return { token: `mock-${phone}`, user: { id: `u${phone.replace(/\D/g, '')}`, phone } }
  },
  async interpret(_session, step, text) {
    await wait(350)
    return parseLocally(step, text)
  },
  async book() {
    await wait(700)
    return { notified: false }
  },
  async saveInterests() {},
}

function httpApi(base: string): Api {
  async function call<T>(path: string, body: unknown, session?: Session): Promise<T> {
    let res: Response
    try {
      res = await fetch(base.replace(/\/$/, '') + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: `Bearer ${session.token}` } : {}) },
        body: JSON.stringify(body),
      })
    } catch {
      throw new ApiError('No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.')
    }
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new ApiError(typeof data?.error === 'string' ? data.error : 'Algo salió mal. Inténtalo de nuevo en un momento.')
    }
    return res.status === 204 ? (undefined as T) : res.json()
  }

  return {
    mock: false,
    requestCode: (phone) => call('/auth/code', { phone }),
    verifyCode: (phone, code) => call('/auth/verify', { phone, code }),
    async interpret(session, step, text, draft) {
      try {
        const { answer } = await call<{ answer: Answer | null }>('/chat/interpret', { step, text, draft }, session)
        return answer && answer.step === step ? answer : null
      } catch {
        // If the model is unreachable, keep the conversation moving with the keyword parser.
        return parseLocally(step, text)
      }
    },
    book: (session, booking) => call('/appointments', { booking }, session),
    saveInterests: (session, intents) => call('/interests', { intents }, session),
  }
}

const base = import.meta.env.VITE_API_URL as string | undefined
export const api: Api = base ? httpApi(base) : mockApi
