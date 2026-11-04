import { useSyncExternalStore } from 'react'
import type { ChatState, PresetSlot } from '../chat/types.ts'
import type { Session } from './api.ts'

const SESSION_KEY = 'tilin.session'
const chatKey = (userId: string) => `tilin.chat.${userId}`

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

// Session store: cached so useSyncExternalStore gets a stable snapshot.
let current = readJson<Session>(SESSION_KEY)
const listeners = new Set<() => void>()

export function setSession(session: Session | null) {
  current = session
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
  listeners.forEach((l) => l())
}

export function useSession() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => current,
  )
}

/** Conversation for a user, so they can pick up where they left off. */
export const loadChat = (userId: string) => readJson<ChatState>(chatKey(userId))
export const saveChat = (userId: string, state: ChatState) => localStorage.setItem(chatKey(userId), JSON.stringify(state))

/** Appointment picked on the landing page by a signed-out user, carried through sign-in (this tab only). */
const SLOT_KEY = 'tilin.pendingSlot'
export const setPendingSlot = (slot: PresetSlot) => sessionStorage.setItem(SLOT_KEY, JSON.stringify(slot))
export function readPendingSlot(): PresetSlot | null {
  try {
    const raw = sessionStorage.getItem(SLOT_KEY)
    return raw ? (JSON.parse(raw) as PresetSlot) : null
  } catch {
    return null
  }
}
export const clearPendingSlot = () => sessionStorage.removeItem(SLOT_KEY)
