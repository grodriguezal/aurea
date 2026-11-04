import { useSyncExternalStore } from 'react'

/** App screens live under "#/…"; plain "#section" anchors stay on the landing page. */
export type Route = 'home' | 'signin' | 'chat'

const HASHES: Record<Exclude<Route, 'home'>, string> = { signin: '#/entrar', chat: '#/chat' }

/** href for links to a screen. */
export const SIGNIN_HREF = HASHES.signin

function read(): Route {
  if (location.hash === HASHES.signin) return 'signin'
  if (location.hash === HASHES.chat) return 'chat'
  return 'home'
}

export function useRoute() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('hashchange', cb)
      return () => window.removeEventListener('hashchange', cb)
    },
    read,
  )
}

/** Moves to a screen; `replace` avoids a back-button entry (used for redirects). */
export function navigate(route: Route, { replace = false } = {}) {
  const hash = route === 'home' ? '#inicio' : HASHES[route]
  if (replace) {
    history.replaceState(null, '', hash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    location.hash = hash
  }
}
