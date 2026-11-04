import { useState } from 'react'
import { INTENTS, KARAT_OPTIONS, labelOf, PIECES, PRIORITIES, ZONES, type Option } from '../../chat/labels.ts'
import type { Answer, ChatState, Intent, Piece } from '../../chat/types.ts'
import { storeById } from '../../data/stores.ts'
import { dateKey, dateLabel } from '../../lib/dates.ts'
import { storeSlots } from '../../lib/pricing.ts'
import Calendar from '../Calendar.tsx'

/** Answer plus the text shown in the user's bubble. Schedule answers get `notified` filled in after booking. */
export type Submit = (answer: Answer, label: string) => void

function Chips<T>({ options, onPick, disabled }: { options: Option<T>[]; onPick: (o: Option<T>) => void; disabled: boolean }) {
  return (
    <div className="chips" role="group">
      {options.map((o) => (
        <button type="button" className="chip" key={String(o.value)} disabled={disabled} onClick={() => onPick(o)}>
          {o.label}
          {o.soon && <span className="chip-soon">Pronto</span>}
        </button>
      ))}
    </div>
  )
}

function MultiChips<T>({ options, onDone, disabled, doneLabel, none }: {
  options: Option<T>[]
  onDone: (values: T[]) => void
  disabled: boolean
  doneLabel: string
  /** Optional "none of these" chip that submits an empty selection. */
  none?: string
}) {
  const [picked, setPicked] = useState<T[]>([])
  const toggle = (v: T) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))
  return (
    <div className="chips-multi">
      <div className="chips" role="group">
        {options.map((o) => {
          const on = picked.includes(o.value)
          return (
            <button type="button" className={`chip${on ? ' selected' : ''}`} key={String(o.value)} aria-pressed={on} disabled={disabled} onClick={() => toggle(o.value)}>
              {on && <span aria-hidden="true">✓ </span>}
              {o.label}
            </button>
          )
        })}
        {none && (
          <button type="button" className="chip chip-quiet" disabled={disabled} onClick={() => onDone([])}>
            {none}
          </button>
        )}
      </div>
      <button type="button" className="button button-dark chips-done" disabled={disabled || picked.length === 0} onClick={() => onDone(picked)}>
        {doneLabel}
      </button>
    </div>
  )
}

function Schedule({ storeId, onSubmit, disabled }: { storeId: string; onSubmit: Submit; disabled: boolean }) {
  const store = storeById(storeId)
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  if (!store) return null
  return (
    <div className="chat-card chat-calendar">
      <Calendar
        day={day}
        time={time}
        onDay={(k) => {
          setDay(k)
          setTime('')
        }}
        onTime={setTime}
        isOpen={(d) => storeSlots(store, dateKey(d)).length > 0}
        timesFor={(k) => storeSlots(store, k)}
        windowDays={30}
      />
      <button
        type="button"
        className="button button-dark button-full"
        disabled={disabled || !day || !time}
        onClick={() => onSubmit({ step: 'schedule', day, time, notified: false }, `${dateLabel(day)}, ${time}`)}
      >
        {disabled ? 'AGENDANDO…' : day && time ? `AGENDAR · ${time}` : 'ELIGE DÍA Y HORA'}
      </button>
    </div>
  )
}

/** The tap-to-answer controls for the current step. */
export default function StepInput({ state, onSubmit, busy }: { state: ChatState; onSubmit: Submit; busy: boolean }) {
  const { step, draft } = state
  switch (step) {
    case 'intent':
      return <Chips options={INTENTS} disabled={busy} onPick={(o) => onSubmit({ step, intent: o.value }, o.label)} />
    case 'sellInstead':
      return (
        <Chips
          options={[{ value: true, label: 'Sí, quiero vender' }, { value: false, label: 'Por ahora no' }]}
          disabled={busy}
          onPick={(o) => onSubmit({ step, yes: o.value }, o.label)}
        />
      )
    case 'pieces':
      return (
        <MultiChips<Piece>
          options={PIECES}
          disabled={busy}
          doneLabel="CONTINUAR"
          onDone={(pieces) => onSubmit({ step, pieces }, pieces.map((p) => labelOf(PIECES, p)).join(', '))}
        />
      )
    case 'weight':
      return <Chips options={[{ value: null, label: 'No lo sé' }]} disabled={busy} onPick={(o) => onSubmit({ step, weight: o.value }, o.label)} />
    case 'karat':
      return <Chips options={KARAT_OPTIONS} disabled={busy} onPick={(o) => onSubmit({ step, karat: o.value }, o.label)} />
    case 'priority':
      return <Chips options={PRIORITIES} disabled={busy} onPick={(o) => onSubmit({ step, priority: o.value }, o.label)} />
    case 'zone':
      return <Chips options={ZONES} disabled={busy} onPick={(o) => onSubmit({ step, zone: o.value }, o.label)} />
    case 'schedule':
      return draft.storeId ? <Schedule key={draft.storeId} storeId={draft.storeId} onSubmit={onSubmit} disabled={busy} /> : null
    case 'crossSell':
      return (
        <MultiChips<Intent>
          options={INTENTS.filter((o) => o.value !== 'vender')}
          disabled={busy}
          doneLabel="CONTINUAR"
          none="Por ahora no"
          onDone={(interests) => onSubmit({ step, interests }, interests.length ? interests.map((i) => labelOf(INTENTS, i)).join(', ') : 'Por ahora no')}
        />
      )
    default:
      return null
  }
}
