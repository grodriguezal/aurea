import { reveal } from '../../lib/reveal.ts'
import { useState } from 'react'
import chevron from '../../assets/chevron.svg'
import { STORES } from '../../data/stores.ts'
import { api, ApiError } from '../../lib/api.ts'
import { dateKey, dateLabel } from '../../lib/dates.ts'
import { formatPhone } from '../../lib/phone.ts'
import { storeSlots } from '../../lib/pricing.ts'
import { navigate } from '../../lib/route.ts'
import { setPendingSlot, useSession } from '../../lib/session.ts'
import Calendar from '../Calendar.tsx'

type Status = { kind: 'idle' } | { kind: 'booking' } | { kind: 'booked'; notified: boolean } | { kind: 'error'; message: string }

/**
 * Pick a jeweler, day and time. Signed in: books on the spot.
 * Signed out: carries the choice through sign-in into the chat, which asks for the rest.
 */
export default function Booking() {
  const session = useSession()
  const [storeId, setStoreId] = useState(STORES[0].id)
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const store = STORES.find((s) => s.id === storeId) ?? STORES[0]

  const reset = () => setStatus({ kind: 'idle' })

  const book = async () => {
    if (!day || !time) return
    if (!session) {
      setPendingSlot({ storeId, day, time })
      navigate('signin')
      return
    }
    setStatus({ kind: 'booking' })
    try {
      const { notified } = await api.book(session, { storeId, day, time, pieces: [], weight: null, karat: null })
      setStatus({ kind: 'booked', notified })
    } catch (e) {
      setStatus({ kind: 'error', message: e instanceof ApiError ? e.message : 'No pudimos agendar la cita. Inténtalo de nuevo.' })
    }
  }

  return (
    <section className="container section booking-section" id="cita" aria-labelledby="bookingHeading">
      <div className="panel booking-calendar" {...reveal()}>
        <div className="booking-head">
          <p className="eyebrow"><span aria-hidden="true">✦</span> Cuando sepas dónde quieres ir</p>
          <h2 id="bookingHeading" className="result-title">Elige cuándo realizar tu valoración</h2>
          <p className="booking-intro">Después de comparar, el siguiente paso es revisar tus piezas en persona. Explora el calendario y elige una joyería. Por ahora, los establecimientos y horarios son ilustrativos.</p>
          <label className="field">
            <span className="field-label">Joyería de tu preferencia</span>
            <span className="field-box field-select">
              <select
                value={storeId}
                onChange={(e) => {
                  setStoreId(e.target.value)
                  setDay('')
                  setTime('')
                  reset()
                }}
              >
                {STORES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} · {s.address}{s.example ? ' · ejemplo' : ''}</option>
                ))}
              </select>
              <img src={chevron} width={20} height={20} alt="" />
            </span>
          </label>
        </div>

        <div className="booking-actions">
          <div className="booking-summary">{day && time ? `${store.name} · ${dateLabel(day)} · ${time}` : 'Elige día y hora para continuar.'}</div>
          <button type="button" className="button button-dark button-full" disabled={!(day && time) || status.kind === 'booking' || status.kind === 'booked'} onClick={() => void book()}>
            {status.kind === 'booking' ? 'AGENDANDO…' : session ? 'AGENDAR CITA' : 'CONTINUAR CON LA CITA'}
          </button>
          {!session && <p className="fine-print">Te pediremos tu WhatsApp para confirmar la cita y conocer tus piezas.</p>}

          {status.kind === 'error' && <p className="form-error" role="alert">{status.message}</p>}
          <div className="booking-feedback" role="status" aria-live="polite" hidden={status.kind !== 'booked'}>
            {status.kind === 'booked' && session && (
              <>
                <strong>{api.mock ? 'Horario seleccionado para la demostración' : '¡Tu cita está agendada!'}</strong>
                <p>
                  <b>{store.name}</b>, {dateLabel(day)} a las {time}.{' '}
                  {api.mock ? 'No se ha registrado una reserva ni se ha notificado a la joyería.' : status.notified ? `Te enviamos la confirmación por WhatsApp al ${formatPhone(session.user.phone)}.` : 'La cita se registró, pero no pudimos enviar la notificación por WhatsApp.'}
                </p>
              </>
            )}
          </div>
          {store.example && <p className="fine-print">Estas joyerías, fechas y horas son ejemplos; no representan disponibilidad real ni reservas confirmadas.</p>}
        </div>
        <Calendar
          className="booking-cal"
          key={storeId}
          day={day}
          time={time}
          onDay={(key) => {
            setDay(key)
            setTime('')
            reset()
          }}
          onTime={(t) => {
            setTime(t)
            reset()
          }}
          isOpen={(d) => storeSlots(store, dateKey(d)).length > 0}
          timesFor={(key) => storeSlots(store, key)}
          windowDays={30}
        />
      </div>
    </section>
  )
}
