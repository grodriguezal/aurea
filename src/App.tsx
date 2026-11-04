import { useEffect, useState } from 'react'
import Drawer from './components/Drawer.tsx'
import Chat from './pages/Chat.tsx'
import Home from './pages/Home.tsx'
import SignIn from './pages/SignIn.tsx'
import { closeDrawer, navigate, useRoute } from './lib/route.ts'
import { useSession } from './lib/session.ts'

export default function App() {
  const route = useRoute()
  const session = useSession()

  // Signed-in users skip sign-in; signed-out users can't reach the chat.
  const target = route === 'signin' && session ? 'chat' : route === 'chat' && !session ? 'signin' : route
  useEffect(() => {
    if (target !== route) navigate(target, { replace: true })
  }, [target, route])

  // The drawer keeps showing its last screen while it slides closed.
  const view = target === 'home' ? null : target
  const [lastView, setLastView] = useState(view)
  if (view && view !== lastView) setLastView(view)
  const shown = view ?? lastView

  return (
    <>
      <div inert={!!view}>
        <Home />
      </div>
      <Drawer open={!!view} onClose={closeDrawer} label={shown === 'chat' ? 'Conversación con Tilín' : 'Entra con WhatsApp'}>
        {shown === 'chat' && session ? <Chat key={session.user.id} session={session} /> : <SignIn />}
      </Drawer>
    </>
  )
}
