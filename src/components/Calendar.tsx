import { useState } from 'react'
import { dateKey, MONTHS, today } from '../lib/dates.ts'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

interface Props {
  day: string
  time: string
  onDay: (key: string) => void
  onTime: (time: string) => void
  /** Whether the given date can be booked at all. */
  isOpen: (date: Date) => boolean
  /** Bookable times ("HH:MM") for a date key. */
  timesFor: (key: string) => string[]
  /** How far ahead dates can be picked. */
  windowDays?: number
  className?: string
}

/** Month grid plus time slots; selection state is owned by the parent. */
export default function Calendar({ day, time, onDay, onTime, isOpen, timesFor, windowDays = 60, className = '' }: Props) {
  const [month, setMonth] = useState(() => new Date(today().getFullYear(), today().getMonth(), 1))

  const min = today()
  const max = new Date(min)
  max.setDate(min.getDate() + windowDays)
  const firstMonth = new Date(min.getFullYear(), min.getMonth(), 1)
  const lastMonth = new Date(max.getFullYear(), max.getMonth(), 1)

  const y = month.getFullYear()
  const m = month.getMonth()
  const leadingBlanks = (new Date(y, m, 1).getDay() + 6) % 7
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const times = day ? timesFor(day) : []

  return (
    <div className={`calendar ${className}`}>
      <div className="calendar-head">
        <button type="button" className="cal-arrow" aria-label="Mes anterior" disabled={month <= firstMonth} onClick={() => setMonth(new Date(y, m - 1, 1))}>‹</button>
        <strong>{MONTHS[m].charAt(0).toUpperCase() + MONTHS[m].slice(1)} {y}</strong>
        <button type="button" className="cal-arrow" aria-label="Mes siguiente" disabled={month >= lastMonth} onClick={() => setMonth(new Date(y, m + 1, 1))}>›</button>
      </div>
      <div className="calendar-grid" aria-label="Fechas disponibles">
        {WEEKDAYS.map((w) => <span className="week-label" key={w}>{w}</span>)}
        {Array.from({ length: leadingBlanks }, (_, i) => <span className="calendar-empty" key={`blank-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = new Date(y, m, i + 1)
          const key = dateKey(d)
          const enabled = d >= min && d <= max && isOpen(d)
          return (
            <button
              type="button"
              key={key}
              className={`calendar-day${enabled && key === day ? ' selected' : ''}`}
              disabled={!enabled}
              aria-pressed={enabled && key === day}
              aria-label={d.toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long' })}
              onClick={() => onDay(key)}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {day && (
        <div className="time-options">
          {times.length === 0 ? (
            <p>No quedan horarios para este día. Prueba con otra fecha.</p>
          ) : (
            times.map((t) => (
              <button type="button" key={t} className={`time-slot${t === time ? ' selected' : ''}`} aria-pressed={t === time} onClick={() => onTime(t)}>
                {t}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
