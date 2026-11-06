import { itemSummary, PRIORITY_TAG, yourPieces } from '../../chat/labels.ts'
import type { BookingSnapshot, Piece } from '../../chat/types.ts'
import { STORES, storeById, type Karat, type Store } from '../../data/stores.ts'
import { dateLabel } from '../../lib/dates.ts'
import { amount, amountCents } from '../../lib/format.ts'
import { marketEstimate, storeEstimate, type Estimate, type Priority } from '../../lib/pricing.ts'
import { formatPhone } from '../../lib/phone.ts'
import StoreCardGroup from '../StoreCards.tsx'

export type SpotState = { status: 'loading' } | { status: 'error' } | { status: 'ok'; price: number; timestamp: Date }

const spotPrice = (spot: SpotState) => (spot.status === 'ok' ? spot.price : null)

const rangeText = (e: Estimate) => {
  // "USD 640 – 670": the currency once, so the range fits on one line. Per-gram figures keep cents.
  const r = (n: number) => (e.perGram ? amountCents : amount).format(n)
  const value = r(e.low) === r(e.high) ? r(e.low) : `${r(e.low)} – ${r(e.high)}`
  return `USD ${value}${e.perGram ? ' / g' : ''}`
}

export function EstimateCard({ pieces, weight, karat, storeId, spot }: { pieces: Piece[]; weight: number | null; karat: Karat | null; storeId?: string; spot: SpotState }) {
  const store = storeId ? storeById(storeId) : undefined
  const estimate = store ? storeEstimate(store, weight, karat, spotPrice(spot)) : marketEstimate(STORES, weight, karat, spotPrice(spot))
  return (
    <div className="chat-card estimate-card">
      <span className="summary-label">{weight ? 'Precio aproximado' : 'Precio aproximado por gramo'}</span>
      <strong className="estimate-price">{estimate ? rangeText(estimate) : spot.status === 'loading' ? '…' : '—'}</strong>
      <p className="estimate-for">{itemSummary(pieces, weight, karat)}</p>
      <small>Esto es un rango orientativo. La oferta final se confirmará por la joyería al revisar {yourPieces(pieces)} en persona.</small>
    </div>
  )
}

export function OptionsCard({ storeIds, priority, weight, karat, spot, chosenId, active, onChoose }: {
  storeIds: string[]
  priority: Priority
  weight: number | null
  karat: Karat | null
  spot: SpotState
  chosenId?: string
  /** Whether choosing (or, until booking, switching) is still possible. */
  active: boolean
  onChoose: (storeId: string) => void
}) {
  const stores = storeIds.map(storeById).filter((s): s is Store => !!s)
  return (
    <div className="chat-options">
      <StoreCardGroup
        label="Joyerías sugeridas"
        items={stores.map((s, i) => {
          const estimate = storeEstimate(s, weight, karat, spotPrice(spot))
          return { store: s, tag: i === 0 ? PRIORITY_TAG[priority] : undefined, price: estimate ? rangeText(estimate) : '—', priceLabel: 'Precio aproximado', details: true }
        })}
        selected={stores.findIndex((s) => s.id === chosenId)}
        onSelect={(i) => onChoose(stores[i].id)}
        disabled={!active}
        selectOnArrow={false}
        carousel
      />
      {active && <p className="chat-options-hint">{chosenId ? '¿Cambiaste de opinión? Toca otra joyería.' : 'Toca una joyería para elegirla y continuar.'}</p>}
    </div>
  )
}

export function BookingCard({ booking, phone }: { booking: BookingSnapshot; phone: string }) {
  const store = storeById(booking.storeId)
  return (
    <div className="chat-card booking-card" role="status">
      <p className="eyebrow eyebrow-dark"><span aria-hidden="true">✦</span> Cita agendada</p>
      <p className="booking-card-text">
        Ya tu cita está agendada para <b>vender</b> {yourPieces(booking.pieces)} ({itemSummary(booking.pieces, booking.weight, booking.karat)}) en <b>{store?.name ?? 'la joyería'}</b> el <b>{dateLabel(booking.day)}</b> a las <b>{booking.time}</b>.
      </p>
      {store && (
        <p className="booking-card-meta">
          {store.address}, {store.municipio}
          {store.mapsUrl && <> · <a href={store.mapsUrl} target="_blank" rel="noreferrer">Cómo llegar</a></>}
        </p>
      )}
      <p className="booking-card-meta">
        {booking.notified ? `Te enviamos la confirmación por WhatsApp al ${formatPhone(phone)}.` : `Modo de prueba: la confirmación por WhatsApp al ${formatPhone(phone)} todavía no se envía.`}
      </p>
    </div>
  )
}
