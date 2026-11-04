import { useSyncExternalStore } from 'react'
import type { ChatState } from '../chat/types.ts'
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
