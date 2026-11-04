import { useSyncExternalStore } from 'react'

/** App screens live under "#/…" and open in the drawer; plain "#section" anchors stay on the landing page. */
export type Route = 'home' | 'signin' | 'chat'

const HASHES: Record<Exclude<Route, 'home'>, string> = { signin: '#/entrar', chat: '#/chat' }

/** href for links that open the drawer at sign-in. */
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

const notify = () => window.dispatchEvent(new HashChangeEvent('hashchange'))

/** Moves to a screen; `replace` avoids a back-button entry (used for redirects and sign-in → chat). */
export function navigate(route: Route, { replace = false } = {}) {
  const hash = route === 'home' ? '#inicio' : HASHES[route]
  if (replace) {
    // Keep the history state so closeDrawer() still knows whether it can step back.
    history.replaceState(history.state, '', hash)
    notify()
  } else {
    history.pushState({ drawer: true }, '', hash)
    notify()
  }
}

/**
 * Closes the drawer without moving the page behind it. Steps back when the drawer was
 * opened in-app (so Back doesn't reopen it); otherwise drops the hash in place.
 */
export function closeDrawer() {
  if (read() === 'home') return
  if (history.state?.drawer) {
    history.back()
  } else {
    history.replaceState(null, '', location.pathname + location.search)
    notify()
  }
}

/** Click handler for links to the drawer: opens it with a history entry that closeDrawer() can undo. */
export function openSignIn(e: { preventDefault(): void }) {
  e.preventDefault()
  navigate('signin')
}
