import { useState } from 'react'
import chevron from '../../assets/chevron.svg'
import { JEWELERS } from '../../data/jewelers.ts'
import { dateLabel, keyDate } from '../../lib/dates.ts'
import Calendar from '../Calendar.tsx'

const timesFor = (key: string) => (keyDate(key).getDay() === 6 ? ['09:30', '11:00', '12:30'] : ['10:00', '11:30', '15:00', '16:30'])

interface Props {
  shop: number
  onShopChange: (index: number) => void
}

export default function Booking({ shop, onShopChange }: Props) {
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  // A new shop resets the chosen slot.
  const [prevShop, setPrevShop] = useState(shop)
  if (shop !== prevShop) {
    setPrevShop(shop)
    setDay('')
    setTime('')
    setConfirmed(false)
  }

  return (
    <section className="container section" id="cita">
      <div className="section-head">
        <p className="eyebrow"><span aria-hidden="true">✦</span> Elige tu momento</p>
        <h2 className="display display-md">La cita, a tu ritmo.</h2>
        <p className="lede">Selecciona una joyería, el día y la hora que te convengan. La valoración en tienda te permitirá conocer una propuesta definitiva.</p>
      </div>
      <div className="booking">
        <div className="booking-steps">
          <h3>Tu visita en tres pasos</h3>
          <ol>
            <li><span className="step-badge">01</span><p><strong>Elige un establecimiento</strong>Compara las referencias de compra.</p></li>
            <li><span className="step-badge">02</span><p><strong>Selecciona fecha y hora</strong>Escoge una opción en el calendario.</p></li>
            <li><span className="step-badge">03</span><p><strong>Decide después de la visita</strong>Consultar no te obliga a vender.</p></li>
          </ol>
        </div>
        <div className="panel booking-calendar" aria-labelledby="bookingHeading">
          <p className="eyebrow"><span aria-hidden="true">✦</span> Calendario de citas</p>
          <h3 id="bookingHeading" className="result-title">Encuentra tu momento</h3>
          <label className="field">
            <span className="field-label">Joyería de tu preferencia</span>
            <span className="field-box field-select">
              <select value={shop} onChange={(e) => onShopChange(Number(e.target.value))}>
                {JEWELERS.map((j, i) => <option key={j.name} value={i}>{j.name} · Establecimiento de ejemplo</option>)}
              </select>
              <img src={chevron} width={20} height={20} alt="" />
            </span>
          </label>

          <Calendar
            day={day}
            time={time}
            onDay={(key) => {
              setDay(key)
              setTime('')
              setConfirmed(false)
            }}
            onTime={(t) => {
              setTime(t)
              setConfirmed(false)
            }}
            isOpen={(d) => d.getDay() !== 0}
            timesFor={timesFor}
          />
          <div className="booking-summary">{day && time ? `${JEWELERS[shop].name} · ${dateLabel(day)} · ${time}` : 'Elige día y hora para continuar.'}</div>
          <button type="button" className="button button-dark button-full" disabled={!(day && time)} onClick={() => setConfirmed(true)}>
            CONTINUAR CON LA CITA
          </button>
          <p className="fine-print">Calendario ilustrativo: las fechas y horas mostradas no representan disponibilidad real y no se registran reservas.</p>
          <div className="booking-feedback" role="status" aria-live="polite" hidden={!confirmed}>
            {confirmed && (
              <>
                <strong>¡Tu elección está preparada!</strong>
                <p>Has seleccionado <b>{JEWELERS[shop].name}</b>, {dateLabel(day)} a las {time}. Este ejemplo no registra ni confirma una cita; la reserva se realizará cuando el establecimiento esté conectado.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
