import { useEffect } from 'react'
import Chat from './pages/Chat.tsx'
import Home from './pages/Home.tsx'
import SignIn from './pages/SignIn.tsx'
import { navigate, useRoute } from './lib/route.ts'
import { useSession } from './lib/session.ts'

export default function App() {
  const route = useRoute()
  const session = useSession()

  // Signed-in users skip the sign-in screen; signed-out users can't reach the chat.
  const target = route === 'signin' && session ? 'chat' : route === 'chat' && !session ? 'signin' : route
  useEffect(() => {
    if (target !== route) navigate(target, { replace: true })
  }, [target, route])

  useEffect(() => {
    if (route !== 'home') window.scrollTo(0, 0)
  }, [route])

  if (target === 'chat' && session) return <Chat key={session.user.id} session={session} />
  if (target === 'signin') return <SignIn />
  return <Home />
}
