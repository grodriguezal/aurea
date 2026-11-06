import { useRef, useState, type KeyboardEvent } from 'react'
import type { Store } from '../data/stores.ts'

export interface StoreCardItem {
  store: Store
  /** Chip in the top-right corner, e.g. "Mayor precio". */
  tag?: string
  /** Already formatted price or price range. */
  price: string
  /** Small label above the price, e.g. "Precio aproximado". */
  priceLabel?: string
  /** Rating shown in the card; defaults to the store's own. */
  rating?: number
  /** Show the store's Google Maps link (chat only). */
  details?: boolean
}

interface Props {
  items: StoreCardItem[]
  /** Index of the chosen card, or -1 when none is chosen yet. */
  selected: number
  onSelect: (index: number) => void
  /** Cards are shown but can no longer be chosen. */
  disabled?: boolean
  /** Arrow keys also choose (home demo). Off where choosing triggers an action, like advancing the chat. */
  selectOnArrow?: boolean
  /** Horizontal swipeable row with dots, for narrow places like the chat. */
  carousel?: boolean
  labelledBy?: string
  label?: string
  className?: string
}

const monogram = (name: string) => name.replace(/^(Joyería|Casa) /, '').charAt(0)

/**
 * Jeweler cards shared by the home comparison and the chat.
 * They form a single-choice group: the whole card is the control and the chosen one turns yellow.
 */
export default function StoreCardGroup({ items, selected, onSelect, disabled = false, selectOnArrow = true, carousel = false, labelledBy, label, className = '' }: Props) {
  const cards = useRef<(HTMLElement | null)[]>([])
  const track = useRef<HTMLDivElement>(null)
  // Carousel: the card currently in view, for the dots.
  const [inView, setInView] = useState(0)

  const onScroll = () => {
    const el = track.current
    const first = cards.current[0]
    if (!el || !first) return
    const step = (cards.current[1]?.offsetLeft ?? first.offsetLeft + first.offsetWidth) - first.offsetLeft
    setInView(Math.min(items.length - 1, Math.round(el.scrollLeft / step)))
  }

  const scrollTo = (i: number) => {
    const el = track.current
    const card = cards.current[i]
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  // With nothing chosen yet, the first card is the one Tab lands on.
  const focusable = selected >= 0 ? selected : 0

  const choose = (i: number) => {
    if (!disabled && i !== selected) onSelect(i)
  }

  // Arrow keys move between cards (and, by default, the selection, as with native radio buttons).
  const onKey = (e: KeyboardEvent, i: number) => {
    if (disabled) return
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (step) {
      e.preventDefault()
      const next = (i + step + items.length) % items.length
      if (selectOnArrow) choose(next)
      cards.current[next]?.focus({ preventScroll: carousel })
      if (carousel) scrollTo(next)
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      choose(i)
    }
  }

  const group = (
    <div className={`store-cards${carousel ? ' store-cards-carousel' : ''} ${className}`} ref={track} onScroll={carousel ? onScroll : undefined} role="radiogroup" aria-labelledby={labelledBy} aria-label={label} aria-disabled={disabled || undefined}>
      {items.map(({ store, tag, price, priceLabel, rating = store.rating, details }, i) => (
        <article
          className={`store-card${i === selected ? ' is-selected' : ''}`}
          key={store.id}
          ref={(el) => { cards.current[i] = el }}
          role="radio"
          aria-checked={i === selected}
          aria-disabled={disabled || undefined}
          aria-label={[store.name, tag, price].filter(Boolean).join(', ')}
          tabIndex={!disabled && i === focusable ? 0 : -1}
          onClick={() => choose(i)}
          onKeyDown={(e) => onKey(e, i)}
        >
          <div className="store-card-top">
            <span className="store-card-monogram" aria-hidden="true">{monogram(store.name)}</span>
            {tag && <span className="store-card-tag">{tag}</span>}
          </div>
          <h4>{store.name}</h4>
          <p className="store-card-location">
            {store.address} · {store.municipio}
            {details && store.mapsUrl && <> · <a href={store.mapsUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Ver en Google Maps</a></>}
          </p>
          {priceLabel && <span className="store-card-price-label">{priceLabel}</span>}
          <strong className={`store-card-price${priceLabel ? ' has-label' : ''}`}>{price}</strong>
          <p className="store-card-review"><span aria-hidden="true">★</span> {rating.toLocaleString('es-VE', { minimumFractionDigits: 1 })} · {store.reviews} opiniones</p>
        </article>
      ))}
    </div>
  )

  if (!carousel) return group
  return (
    <div className="store-carousel">
      {group}
      <div className="store-carousel-dots">
        {items.map(({ store }, i) => (
          <button type="button" key={store.id} className={i === inView ? 'is-current' : ''} aria-label={`Ver ${store.name}`} aria-current={i === inView || undefined} onClick={() => scrollTo(i)} />
        ))}
      </div>
    </div>
  )
}
