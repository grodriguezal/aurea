import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { applyAnswer, misunderstood, restartChat, startChat, TEXT_STEPS } from '../chat/flow.ts'
import type { Answer, ChatState, Message } from '../chat/types.ts'
import { BookingCard, EstimateCard, OptionsCard, type SpotState } from '../components/chat/Cards.tsx'
import StepInput from '../components/chat/StepInput.tsx'
import { ChatMascot } from '../components/Characters.tsx'
import Logo from '../components/Logo.tsx'
import { storeById } from '../data/stores.ts'
import { api, ApiError, type Session } from '../lib/api.ts'
import { fetchSpotPrice } from '../lib/goldPrice.ts'
import { formatPhone } from '../lib/phone.ts'
import { navigate } from '../lib/route.ts'
import { loadChat, saveChat, setSession } from '../lib/session.ts'

const REVEAL_MS = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 550

const PLACEHOLDERS: Partial<Record<ChatState['step'], string>> = {
  weight: 'Ej. 12 gramos',
  karat: 'Ej. 18k',
  zone: 'Ej. Las Mercedes',
}

export default function Chat({ session }: { session: Session }) {
  const [initial] = useState(() => loadChat(session.user.id))
  const [state, setState] = useState<ChatState>(() => initial ?? startChat())
  // Messages appear one at a time, like someone typing; a restored conversation shows at once.
  const [shown, setShown] = useState(initial ? initial.messages.length : 0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  /** Typed text shown as the user's bubble while it's being interpreted. */
  const [pending, setPending] = useState('')
  const [spot, setSpot] = useState<SpotState>({ status: 'loading' })
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadSpot = useCallback(
    () =>
      fetchSpotPrice().then(
        (s) => setSpot({ status: 'ok', price: s.price, timestamp: s.timestamp }),
        () => setSpot({ status: 'error' }),
      ),
    [],
  )
  const retrySpot = () => {
    setSpot({ status: 'loading' })
    void loadSpot()
  }

  useEffect(() => {
    void loadSpot()
  }, [loadSpot])

  useEffect(() => saveChat(session.user.id, state), [session.user.id, state])

  // The user's own messages show at once; only the bot's are revealed one by one.
  let visible = shown
  while (visible < state.messages.length && state.messages[visible].from === 'user') visible++

  useEffect(() => {
    if (visible >= state.messages.length) return
    const t = setTimeout(() => setShown(visible + 1), REVEAL_MS)
    return () => clearTimeout(t)
  }, [visible, state.messages.length])

  const revealing = visible < state.messages.length
  const typing = busy || revealing

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: REVEAL_MS ? 'smooth' : 'auto', block: 'end' })
  }, [visible, typing, state.step, pending])

  const spotPrice = spot.status === 'ok' ? spot.price : null

  /** Records side effects and advances the flow. */
  const apply = (answer: Answer, label: string) => {
    if (answer.step === 'crossSell' && answer.interests.length) void api.saveInterests(session, answer.interests).catch(() => {})
    if (answer.step === 'intent' && answer.intent !== 'vender') void api.saveInterests(session, [answer.intent]).catch(() => {})
    setState((s) => applyAnswer(s, answer, label, { spot: spotPrice }))
  }

  /** Answers from chips and widgets; booking goes through the API first. */
  const submit = async (answer: Answer, label: string) => {
    if (busy) return
    setError('')
    if (answer.step !== 'schedule') return apply(answer, label)
    const { draft } = state
    if (!draft.storeId) return
    setBusy(true)
    try {
      const { notified } = await api.book(session, {
        storeId: draft.storeId,
        day: answer.day,
        time: answer.time,
        pieces: draft.pieces,
        weight: draft.weight ?? null,
        karat: draft.karat ?? null,
      })
      apply({ ...answer, notified }, label)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos agendar la cita. Inténtalo de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  /** Free text: interpreted (Gemini via the Worker, or the local parser), else re-asked. */
  const submitText = async (e: FormEvent) => {
    e.preventDefault()
    const value = text.trim()
    if (!value || busy || !TEXT_STEPS.includes(state.step)) return
    setText('')
    setPending(value)
    setError('')
    setBusy(true)
    try {
      const answer = await api.interpret(session, state.step, value, state.draft)
      if (answer) apply(answer, value)
      else setState((s) => misunderstood(s, value))
    } finally {
      setPending('')
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  const signOut = () => {
    setSession(null)
    navigate('home', { replace: true })
  }

  const lastOptionsId = [...state.messages].reverse().find((m) => m.kind === 'options')?.id
  const acceptsText = TEXT_STEPS.includes(state.step)

  const renderMessage = (m: Message) => {
    if (m.from === 'user') return <p className="bubble bubble-user">{m.text}</p>
    switch (m.kind) {
      case 'text':
        return <p className="bubble bubble-bot">{m.text}</p>
      case 'estimate':
        return <EstimateCard pieces={m.pieces} weight={m.weight} karat={m.karat} spot={spot} onRetry={retrySpot} />
      case 'options':
        return (
          <OptionsCard
            storeIds={m.storeIds}
            priority={m.priority}
            weight={state.draft.weight ?? null}
            karat={state.draft.karat ?? null}
            spot={spot}
            chosenId={m.id === lastOptionsId ? state.draft.storeId : undefined}
            active={m.id === lastOptionsId && state.step === 'options' && !busy}
            onChoose={(storeId) => void submit({ step: 'options', storeId }, `Elijo ${storeById(storeId)?.name ?? 'esta joyería'}`)}
          />
        )
      case 'booking':
        return <BookingCard booking={m.booking} phone={session.user.phone} />
    }
  }

  // Consecutive messages from the same side render as one run; "Pensando…" joins (or starts) the bot's.
  const runs: { from: Message['from']; messages: Message[] }[] = []
  const pendingMessage: Message[] = pending ? [{ id: 'pending', from: 'user', kind: 'text', text: pending }] : []
  for (const m of [...state.messages.slice(0, visible), ...pendingMessage]) {
    const last = runs[runs.length - 1]
    if (last?.from === m.from) last.messages.push(m)
    else runs.push({ from: m.from, messages: [m] })
  }
  if (typing && runs[runs.length - 1]?.from !== 'bot') runs.push({ from: 'bot', messages: [] })
  const lastBotRun = runs.findLastIndex((r) => r.from === 'bot')

  return (
    <div className="chat-page">
      <header className="app-bar chat-bar">
        <Logo />
        <div className="chat-bar-actions">
          <span className="chat-bar-phone">{formatPhone(session.user.phone)}</span>
          <button type="button" className="text-button app-bar-link" disabled={busy} onClick={() => setState((s) => restartChat(s))}>
            Nueva consulta
          </button>
          <button type="button" className="text-button app-bar-link" onClick={signOut}>Salir</button>
        </div>
      </header>

      <main className="chat-thread" id="contenido" aria-label="Conversación con Tilín">
        <ol className="chat-messages" aria-live="polite">
          {runs.map((run, i) => (
            // Keyed by position: runs only ever append, so the mascot stays mounted while a run grows.
            <li key={i} className={`chat-run chat-run-${run.from}`}>
              {run.from === 'bot' && <span className="chat-avatar">{i === lastBotRun && <ChatMascot working={typing} />}</span>}
              <div className="chat-run-body">
                {run.messages.map((m) => (
                  <div key={m.id} className={`chat-msg${m.kind !== 'text' ? ' chat-msg-wide' : ''}`}>{renderMessage(m)}</div>
                ))}
                {typing && i === runs.length - 1 && <p className="thinking">Pensando…</p>}
              </div>
            </li>
          ))}
        </ol>

        {!revealing && !typing && (
          <div className="chat-step">
            <StepInput key={`${state.step}-${state.messages.length}`} state={state} onSubmit={(a, l) => void submit(a, l)} busy={busy} />
            {state.step === 'done' && (
              <div className="chips">
                <button type="button" className="button button-dark" onClick={() => setState((s) => restartChat(s))}>HACER OTRA CONSULTA</button>
                <a className="button button-outline" href="#inicio">VOLVER AL INICIO</a>
              </div>
            )}
          </div>
        )}
        {error && <p className="form-error chat-error" role="alert">{error}</p>}
        <div ref={endRef} />
      </main>

      <form className="chat-composer" onSubmit={(e) => void submitText(e)}>
        <label className="visually-hidden" htmlFor="chat-input">Escribe tu respuesta</label>
        <input
          ref={inputRef}
          id="chat-input"
          type="text"
          autoComplete="off"
          enterKeyHint="send"
          maxLength={280}
          placeholder={acceptsText ? (PLACEHOLDERS[state.step] ?? 'Escribe tu respuesta…') : 'Elige una opción de arriba'}
          disabled={!acceptsText || revealing}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="chat-send" aria-label="Enviar" disabled={!acceptsText || busy || revealing || !text.trim()}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5L4 12z" fill="currentColor" /></svg>
        </button>
      </form>
      {api.mock && <p className="chat-mock-note">Modo de prueba · respuestas interpretadas sin IA · no se envían mensajes</p>}
    </div>
  )
}

