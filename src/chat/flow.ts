import { STORES, storeById } from '../data/stores.ts'
import { dateLabel } from '../lib/dates.ts'
import { rankStores } from '../lib/pricing.ts'
import { INTENT_PHRASE, listJoin, namedPiece, piecesPronoun, yourPieces } from './labels.ts'
import type { Answer, BookingSnapshot, ChatState, Draft, Message, PresetSlot, Step } from './types.ts'

/**
 * The scripted sell flow. Pure: (state, answer) → next state, bot copy included.
 * Free text is turned into an `Answer` elsewhere (local parser now, Gemini via the Worker later).
 */

let counter = 0
const id = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`

const bot = (text: string): Message => ({ id: id(), from: 'bot', kind: 'text', text })
const user = (text: string): Message => ({ id: id(), from: 'user', kind: 'text', text })

const emptyDraft = (): Draft => ({ pieces: [], interests: [] })

const ASK_INTENT = '¿Qué quieres hacer con tu oro?'

export function startChat(): ChatState {
  return {
    step: 'intent',
    draft: emptyDraft(),
    messages: [bot('¡Hola! Soy Tilín. Te ayudo a conocer el valor de tu oro y a encontrar dónde moverlo, sin compromiso.'), bot(ASK_INTENT)],
  }
}

/** Starts a fresh consultation in the same thread, keeping the history visible. */
export function restartChat(state: ChatState): ChatState {
  return { step: 'intent', draft: emptyDraft(), messages: [...state.messages, bot('¡Vamos con una nueva consulta! ' + ASK_INTENT)] }
}

const slotText = (slot: PresetSlot) => `${storeById(slot.storeId)?.name ?? 'la joyería'} el ${dateLabel(slot.day)} a las ${slot.time}`

/**
 * Starts from an appointment picked on the landing page: skips intent, priority and
 * store choice, and asks only what's needed to confirm it. Appends to `prev` if there is one.
 */
export function startWithSlot(prev: ChatState | null, slot: PresetSlot): ChatState {
  const greeting = prev ? [] : [bot('¡Hola! Soy Tilín. Te ayudo a conocer el valor de tu oro y a encontrar dónde moverlo, sin compromiso.')]
  return {
    step: 'pieces',
    draft: { ...emptyDraft(), intent: 'vender', storeId: slot.storeId, slot: { day: slot.day, time: slot.time } },
    messages: [
      ...(prev?.messages ?? []),
      ...greeting,
      bot(`Elegiste tu cita en ${slotText(slot)}.`),
      bot('Para confirmarla, cuéntame qué pieza o piezas quieres vender. Puedes elegir varias.'),
    ],
  }
}

const bookingMessage = (draft: Draft, day: string, time: string, notified: boolean): Message => {
  const booking: BookingSnapshot = { storeId: draft.storeId!, day, time, pieces: draft.pieces, weight: draft.weight ?? null, karat: draft.karat ?? null, notified }
  return { id: id(), from: 'bot', kind: 'booking', booking }
}
const ASK_CROSS_SELL = 'Aparte de vender, ¿te interesaría en un futuro…?'

function askWeight(d: Draft) {
  return namedPiece(d.pieces) ? `¿Cuánto pesan ${yourPieces(d.pieces)} aproximadamente? Escríbelo en gramos.` : '¿Cuánto pesan tus piezas en total, aproximadamente? Escríbelo en gramos.'
}

interface Context {
  /** USD per troy ounce of 24K gold, if loaded. */
  spot: number | null
}

/** Applies an answer to the current step. Answers for other steps are ignored. */
export function applyAnswer(state: ChatState, answer: Answer, userText: string, ctx: Context): ChatState {
  if (answer.step !== state.step) return state
  const draft: Draft = { ...state.draft }
  const out: Message[] = [user(userText)]
  let step: Step = state.step

  switch (answer.step) {
    case 'intent': {
      draft.intent = answer.intent
      if (answer.intent === 'vender') {
        out.push(bot('¡Perfecto! ¿Qué pieza o piezas te gustaría vender? Puedes elegir varias.'))
        step = 'pieces'
      } else {
        draft.interests = [...new Set([...draft.interests, answer.intent])]
        out.push(bot(`Estamos preparando ${INTENT_PHRASE[answer.intent]} para ti. Te escribiremos por WhatsApp en cuanto esté disponible.`))
        out.push(bot('Mientras tanto, ¿te gustaría vender alguna pieza?'))
        step = 'sellInstead'
      }
      break
    }
    case 'sellInstead': {
      if (answer.yes) {
        draft.intent = 'vender'
        out.push(bot('¡Genial! ¿Qué pieza o piezas te gustaría vender? Puedes elegir varias.'))
        step = 'pieces'
      } else {
        out.push(bot('¡Perfecto! Aquí estaremos cuando lo necesites.'))
        step = 'done'
      }
      break
    }
    case 'pieces': {
      if (answer.pieces.length === 0) return state
      draft.pieces = answer.pieces
      out.push(bot(askWeight(draft)))
      step = 'weight'
      break
    }
    case 'weight': {
      draft.weight = answer.weight
      if (answer.weight === null) out.push(bot(`No pasa nada: en la joyería ${piecesPronoun(draft.pieces)} pesan frente a ti. Por ahora te mostraré el precio por gramo.`))
      out.push(bot(namedPiece(draft.pieces) ? `¿Sabes de cuántos quilates son ${yourPieces(draft.pieces)}?` : '¿Sabes de cuántos quilates son?'))
      step = 'karat'
      break
    }
    case 'karat': {
      draft.karat = answer.karat
      if (answer.karat === null) out.push(bot('¡No pasa nada! La joyería lo comprueba contigo. Te muestro un rango entre 10k y 18k, que son los más comunes.'))
      const preset = draft.slot && draft.storeId ? { ...draft.slot, storeId: draft.storeId } : null
      out.push({ id: id(), from: 'bot', kind: 'estimate', pieces: draft.pieces, weight: draft.weight ?? null, karat: answer.karat, storeId: preset?.storeId })
      if (preset) {
        out.push(bot(`¿Confirmamos tu cita en ${slotText(preset)}?`))
        step = 'confirm'
      } else {
        out.push(bot('¿Qué te importa más a la hora de vender?'))
        step = 'priority'
      }
      break
    }
    case 'priority': {
      draft.priority = answer.priority
      if (answer.priority === 'cercania') {
        out.push(bot('¿En qué zona estás? Así te muestro las joyerías más cercanas.'))
        step = 'zone'
      } else {
        out.push(...options(draft, ctx))
        step = 'options'
      }
      break
    }
    case 'zone': {
      draft.zone = answer.zone
      out.push(...options(draft, ctx))
      step = 'options'
      break
    }
    case 'options': {
      const store = storeById(answer.storeId)
      if (!store) return state
      draft.storeId = store.id
      out.push(bot(`¡Buena elección! ¿Cuándo te gustaría ir a ${store.name}?`))
      step = 'schedule'
      break
    }
    case 'schedule': {
      if (!draft.storeId) return state
      draft.slot = { day: answer.day, time: answer.time }
      out.push(bookingMessage(draft, answer.day, answer.time, answer.notified))
      out.push(bot(ASK_CROSS_SELL))
      step = 'crossSell'
      break
    }
    case 'confirm': {
      if (!draft.storeId || !draft.slot) return state
      if (answer.confirm) {
        out.push(bookingMessage(draft, draft.slot.day, draft.slot.time, answer.notified))
        out.push(bot(ASK_CROSS_SELL))
        step = 'crossSell'
      } else {
        out.push(bot(`¡Claro! ¿Qué día y hora te vendrían mejor en ${storeById(draft.storeId)?.name ?? 'la joyería'}?`))
        step = 'schedule'
      }
      break
    }
    case 'crossSell': {
      draft.interests = [...new Set([...draft.interests, ...answer.interests])]
      out.push(
        bot(
          answer.interests.length
            ? `¡Anotado! Te avisaremos por WhatsApp cuando ${listJoin(answer.interests.map((i) => INTENT_PHRASE[i]))} esté disponible. ¡Nos vemos en tu cita!`
            : '¡Perfecto! Nos vemos en tu cita. Si necesitas algo más, aquí estaremos.',
        ),
      )
      step = 'done'
      break
    }
  }

  return { step, draft, messages: [...state.messages, ...out] }
}

function options(draft: Draft, ctx: Context): Message[] {
  const ranked = rankStores(STORES, draft.priority ?? 'precio', { zone: draft.zone, karat: draft.karat ?? null, spot: ctx.spot })
  return [bot('Estas son las opciones que conseguimos para ti:'), { id: id(), from: 'bot', kind: 'options', storeIds: ranked.map((s) => s.id), priority: draft.priority ?? 'precio' }]
}

const HINTS: Partial<Record<Step, string>> = {
  intent: 'Puedes decirme si quieres vender, comprar, obtener un crédito, invertir o digitalizar tu oro.',
  sellInstead: '¿Te gustaría vender alguna pieza? Responde sí o no.',
  pieces: 'Cuéntame qué piezas tienes: anillos, cadenas, pulseras, zarcillos u otras.',
  weight: 'Escribe el peso aproximado en gramos, por ejemplo "12 gramos". Si no lo sabes, elige "No lo sé".',
  karat: 'Dime los quilates (10k, 14k, 18k, 21k, 22k o 24k). Si no lo sabes, no pasa nada.',
  priority: '¿Qué prefieres: cercanía, mejor precio o reputación de la tienda?',
  confirm: '¿Confirmamos la cita? Responde sí, o dime si prefieres cambiar la fecha.',
  zone: 'Dime tu municipio o tu urbanización, por ejemplo "Chacao" o "Las Mercedes".',
  crossSell: 'Puedes elegir comprar, obtener un crédito, invertir o digitalizar, o decirme "por ahora no".',
}

/** While choosing a day (before booking), tapping another jeweler switches to it and restarts the calendar. */
export function changeStore(state: ChatState, storeId: string): ChatState {
  const store = storeById(storeId)
  if (state.step !== 'schedule' || !store || store.id === state.draft.storeId) return state
  const draft: Draft = { ...state.draft, storeId: store.id, slot: undefined }
  return { step: 'schedule', draft, messages: [...state.messages, user(`Prefiero ${store.name}`), bot(`Cambiaste a ${store.name}. ¿Cuándo te gustaría ir?`)] }
}

/** Free text that couldn't be mapped to an answer: echo it and re-ask. */
export function misunderstood(state: ChatState, userText: string): ChatState {
  const hint = HINTS[state.step] ?? 'Elige una de las opciones para continuar.'
  return { ...state, messages: [...state.messages, user(userText), bot(`No te entendí del todo. ${hint}`)] }
}

/** Steps where typing is accepted. */
export const TEXT_STEPS: Step[] = ['intent', 'sellInstead', 'pieces', 'weight', 'karat', 'priority', 'zone', 'confirm', 'crossSell']
