import { itemSummary, PRIORITY_TAG } from '../../chat/labels.ts'
import type { BookingSnapshot, Piece } from '../../chat/types.ts'
import { STORES, storeById, type Karat, type Store } from '../../data/stores.ts'
import { dateLabel } from '../../lib/dates.ts'
import { money, wholeMoney } from '../../lib/format.ts'
import { TROY_OZ_GRAMS } from '../../lib/goldPrice.ts'
import { marketEstimate, storeEstimate, type Estimate, type Priority } from '../../lib/pricing.ts'
import { formatPhone } from '../../lib/phone.ts'

export type SpotState = { status: 'loading' } | { status: 'error' } | { status: 'ok'; price: number; timestamp: Date }

const spotPrice = (spot: SpotState) => (spot.status === 'ok' ? spot.price : null)

const rangeText = (e: Estimate) => {
  // Per-gram figures keep cents; totals are rounded to whole dollars.
  const r = (n: number) => (e.perGram ? money : wholeMoney).format(n)
  const value = r(e.low) === r(e.high) ? r(e.low) : `${r(e.low)} – ${r(e.high)}`
  return e.perGram ? `${value} / g` : value
}

function SpotLine({ spot, onRetry }: { spot: SpotState; onRetry: () => void }) {
  return (
    <div className={`market-feed${spot.status === 'error' ? ' rate-error' : ''}`}>
      <span className="market-light" />
      <span>
        {spot.status === 'ok'
          ? `Oro 24K · ${money.format(spot.price / TROY_OZ_GRAMS)}/g · ${spot.timestamp.toLocaleString('es-VE', { dateStyle: 'medium', timeStyle: 'short' })}`
          : spot.status === 'error'
            ? 'No pudimos consultar el precio del oro.'
            : 'Consultando el precio del oro…'}
      </span>
      {spot.status === 'error' && <button type="button" className="text-button" onClick={onRetry}>Reintentar</button>}
    </div>
  )
}

export function EstimateCard({ pieces, weight, karat, spot, onRetry }: { pieces: Piece[]; weight: number | null; karat: Karat | null; spot: SpotState; onRetry: () => void }) {
  const estimate = marketEstimate(STORES, weight, karat, spotPrice(spot))
  return (
    <div className="chat-card estimate-card">
      <span className="summary-label">{weight ? 'Precio aproximado' : 'Precio aproximado por gramo'}</span>
      <strong className="estimate-price">{estimate ? rangeText(estimate) : spot.status === 'loading' ? '…' : '—'}</strong>
      <p className="estimate-for">{itemSummary(pieces, weight, karat)}</p>
      <SpotLine spot={spot} onRetry={onRetry} />
      <small>Rango orientativo en USD según lo que pagan las joyerías. La oferta final se confirma al revisar tu pieza en persona.</small>
    </div>
  )
}

function StoreOption({ store, tag, weight, karat, spot, onChoose, chosen, disabled }: {
  store: Store
  tag?: string
  weight: number | null
  karat: Karat | null
  spot: SpotState
  onChoose: () => void
  chosen: boolean
  disabled: boolean
}) {
  const estimate = storeEstimate(store, weight, karat, spotPrice(spot))
  return (
    <article className={`offer-card chat-offer${chosen ? ' chosen' : ''}`}>
      <div className="offer-card-top">
        <span className="shop-monogram" aria-hidden="true">{store.name.replace(/^(Joyería|Casa) /, '').slice(0, 1)}</span>
        {tag && <span className="offer-tag">{tag}</span>}
      </div>
      <h4>{store.name}</h4>
      <p className="shop-area">
        {store.address}, {store.municipio}
        {store.mapsUrl && <> · <a href={store.mapsUrl} target="_blank" rel="noreferrer">Ver en Google Maps</a></>}
      </p>
      <p className="shop-review">
        <span aria-hidden="true">★</span> {store.rating.toLocaleString('es-VE', { minimumFractionDigits: 1 })} <small>({store.reviews} opiniones{store.example ? ' ilustrativas' : ''})</small>
      </p>
      <p className="shop-description">{store.description}</p>
      <div className="shop-amount">
        <small>Precio aproximado</small>
        <strong>{estimate ? rangeText(estimate) : '—'}</strong>
      </div>
      <button type="button" className={`button ${chosen ? 'button-yellow' : 'button-outline'} shop-book`} disabled={disabled} aria-pressed={chosen} onClick={onChoose}>
        {chosen ? 'ELEGIDA' : 'ELEGIR'}
      </button>
    </article>
  )
}

export function OptionsCard({ storeIds, priority, weight, karat, spot, chosenId, active, onChoose }: {
  storeIds: string[]
  priority: Priority
  weight: number | null
  karat: Karat | null
  spot: SpotState
  chosenId?: string
  /** Whether choosing is still possible (this is the current step). */
  active: boolean
  onChoose: (storeId: string) => void
}) {
  const stores = storeIds.map(storeById).filter((s): s is Store => !!s)
  return (
    <div className="chat-options">
      {stores.map((s, i) => (
        <StoreOption
          key={s.id}
          store={s}
          tag={i === 0 ? PRIORITY_TAG[priority] : undefined}
          weight={weight}
          karat={karat}
          spot={spot}
          chosen={s.id === chosenId}
          disabled={!active}
          onChoose={() => onChoose(s.id)}
        />
      ))}
      {stores.some((s) => s.example) && <p className="sample-notice">Joyerías, reseñas e importes de ejemplo mientras conectamos a las joyerías aliadas.</p>}
    </div>
  )
}

export function BookingCard({ booking, phone }: { booking: BookingSnapshot; phone: string }) {
  const store = storeById(booking.storeId)
  return (
    <div className="chat-card booking-card" role="status">
      <p className="eyebrow eyebrow-dark"><span aria-hidden="true">✦</span> Cita agendada</p>
      <p className="booking-card-text">
        Ya tu cita está agendada para <b>vender</b> {booking.pieces.length === 1 ? 'tu pieza' : 'tus piezas'} ({itemSummary(booking.pieces, booking.weight, booking.karat)}) en <b>{store?.name ?? 'la joyería'}</b> el <b>{dateLabel(booking.day)}</b> a las <b>{booking.time}</b>.
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
