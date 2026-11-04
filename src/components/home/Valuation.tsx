import { useCallback, useRef, useState, type FormEvent } from 'react'
import chevron from '../../assets/chevron.svg'
import { JEWELERS } from '../../data/jewelers.ts'
import { money, number } from '../../lib/format.ts'
import { fetchSpotPrice, TROY_OZ_GRAMS, type SpotPrice } from '../../lib/goldPrice.ts'

const PIECES = ['Anillos', 'Cadenas', 'Pulseras', 'Zarcillos', 'Otra pieza']
const KARATS = ['10K', '14K', '18K', '21K', '22K', '24K']
/** Headline estimate: share of the metal's theoretical value (illustrative). */
const PURCHASE_RATE = 0.7

type Spot = { status: 'loading' } | { status: 'error' } | { status: 'ok'; value: SpotPrice }

interface Props {
  /** Called when the user picks a jeweler from the offers. */
  onChooseShop: (index: number) => void
}

export default function Valuation({ onChooseShop }: Props) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['Anillos']))
  const [weightInput, setWeightInput] = useState('')
  const [purity, setPurity] = useState('')
  const [step, setStep] = useState<1 | 2>(1)
  const [result, setResult] = useState<{ weight: number | null; karat: number | null } | null>(null)
  const [spot, setSpot] = useState<Spot | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const weightRef = useRef<HTMLInputElement>(null)

  const loadSpot = useCallback(async () => {
    setSpot({ status: 'loading' })
    try {
      setSpot({ status: 'ok', value: await fetchSpotPrice() })
    } catch {
      setSpot({ status: 'error' })
    }
  }, [])

  /** Switches step, then brings the card into view (and optionally focuses the weight field). */
  const goToStep = (next: 1 | 2, focusWeightField = false) => {
    setStep(next)
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (focusWeightField) weightRef.current?.focus({ preventScroll: true })
    })
  }

  const togglePiece = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const input = weightRef.current
    const raw = weightInput.trim()
    const weight = raw === '' ? null : Number(raw)
    if (weight !== null && (!Number.isFinite(weight) || weight <= 0 || weight > 100000)) {
      input?.setCustomValidity('Introduce un peso válido superior a cero.')
      input?.reportValidity()
      return
    }
    input?.setCustomValidity('')
    setResult({ weight, karat: purity ? parseInt(purity, 10) : null })
    goToStep(2)
    if (spot === null || spot.status === 'error') void loadSpot()
  }

  const canCalculate = !!result && (result.weight ?? 0) > 0 && (result.karat ?? 0) > 0
  const pure = canCalculate ? (result.weight! * result.karat!) / 24 : 0
  const gross = canCalculate && spot?.status === 'ok' ? (pure * spot.value.price) / TROY_OZ_GRAMS : 0

  const piecesLabel = selected.size ? Array.from(selected).join(', ').toLowerCase() : 'piezas de oro'
  const extras = result
    ? `${result.weight ? ` · ${number.format(result.weight)} g` : ''}${result.karat ? ` · ${result.karat}K` : ''}`
    : ''

  return (
    <section className="container valuation" id="valoracion" aria-label="Valora tus piezas">
      <div className="panel valuation-card" ref={cardRef}>
        <form onSubmit={handleSubmit} noValidate>
          {step === 1 ? (
            <div className="form-step">
              <div className="panel-head">
                <p className="eyebrow"><span aria-hidden="true">✦</span> Conoce tus piezas</p>
                <p>Selecciona las piezas que te gustaría valorar.</p>
              </div>
              <div className="piece-grid" role="group" aria-label="Tipo de piezas de oro">
                {PIECES.map((name) => {
                  const active = selected.has(name)
                  return (
                    <button type="button" key={name} className={`piece${active ? ' active' : ''}`} aria-pressed={active} onClick={() => togglePiece(name)}>
                      {name}
                    </button>
                  )
                })}
              </div>
              <div className="form-fields">
                <label className="field">
                  <span className="field-label">¿Conoces su peso aproximado? <small>(opcional)</small></span>
                  <span className="field-box">
                    <input
                      ref={weightRef}
                      type="number"
                      min="0"
                      max="99999"
                      step="0.1"
                      inputMode="decimal"
                      placeholder="Ej. 12"
                      value={weightInput}
                      onChange={(e) => {
                        e.target.setCustomValidity('')
                        setWeightInput(e.target.value)
                      }}
                    />
                    <span className="field-unit">Gramos</span>
                  </span>
                </label>
                <label className="field">
                  <span className="field-label">¿Sabes cuántos quilates es? <small>(opcional)</small></span>
                  <span className="field-box field-select">
                    <select value={purity} onChange={(e) => setPurity(e.target.value)}>
                      <option value="">Ej. No lo sé, no pasa nada!</option>
                      {KARATS.map((k) => <option key={k} value={k}>{k}</option>)}
                    </select>
                    <img src={chevron} width={20} height={20} alt="" />
                  </span>
                </label>
              </div>
              <div className="form-footer">
                <p>Puedes empezar sin conocer el peso o los quilates, para mostrarte un importe orientativo necesitamos ambos datos</p>
                <button type="submit" className="button button-dark">CONTINUAR</button>
              </div>
            </div>
          ) : (
            <div className="form-step">
              <div className="panel-head">
                <p className="eyebrow"><span aria-hidden="true">✦</span> El valor de tus piezas</p>
                <h3 className="result-title">¡Descubre cuánto podría valer tu oro!</h3>
                <p>Has elegido <strong>{piecesLabel}</strong>{extras}.</p>
              </div>

              <div className={`market-feed${spot?.status === 'error' ? ' rate-error' : ''}`}>
                <span className="market-light" />
                <span>
                  {spot?.status === 'ok'
                    ? `Oro 24K · ${money.format(spot.value.price / TROY_OZ_GRAMS)}/g · actualizado ${spot.value.timestamp.toLocaleString('es-VE', { dateStyle: 'medium', timeStyle: 'short' })}`
                    : spot?.status === 'error'
                      ? 'No se pudo consultar el precio del oro ahora. Reintenta para calcular una referencia actual.'
                      : 'Consultando la cotización del oro…'}
                </span>
                {spot?.status === 'error' && <button type="button" className="text-button" onClick={() => void loadSpot()}>Reintentar</button>}
              </div>

              {!canCalculate && (
                <div className="notice">
                  <h4>Un dato más para estimar tu oro</h4>
                  <p>Indica el peso aproximado y los quilates. Si no los sabes, en la joyería podrán comprobarlos contigo.</p>
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => goToStep(1, true)}
                  >
                    COMPLETAR DATOS
                  </button>
                </div>
              )}

              {canCalculate && spot?.status === 'ok' && (
                <div className="result-body">
                  <div className="summary">
                    <div className="summary-main">
                      <span className="summary-label">Precio estimado de compra</span>
                      <strong className="summary-price">{money.format(gross * PURCHASE_RATE)}</strong>
                      <small>Importe orientativo en USD. La oferta final se confirma tras la valoración presencial.</small>
                    </div>
                    <dl className="summary-facts">
                      <div><dt>Oro puro estimado</dt><dd>{number.format(pure)} g</dd></div>
                      <div><dt>Pureza indicada</dt><dd>{result.karat}K</dd></div>
                    </dl>
                  </div>
                  <p className="calc-note">
                    <strong>¿Cómo estimamos tu oferta?</strong> Tenemos en cuenta el peso indicado ({number.format(result.weight!)} g), la pureza ({result.karat}K / {number.format((result.karat! / 24) * 100)}%) y la cotización internacional del oro. El precio estimado de compra puede ser inferior al valor teórico del metal y depende de las condiciones de cada joyería.
                  </p>
                  <section className="offers" aria-labelledby="offersHeading">
                    <p className="eyebrow"><span aria-hidden="true">✦</span> Compara tus opciones</p>
                    <h3 id="offersHeading" className="result-title">Tres propuestas para tu oro</h3>
                    <p className="sample-notice">Establecimientos, calificaciones, reseñas e importes ilustrativos para mostrar cómo funcionaría Tilín. No son ofertas reales.</p>
                    <div className="offers-grid">
                      {JEWELERS.map((j, index) => (
                        <article className="offer-card" key={j.name}>
                          <div className="offer-card-top">
                            <span className="shop-monogram" aria-hidden="true">{j.name.replace(/^Joyería /, '').slice(0, 1)}</span>
                            <span className="offer-tag">{j.tag}</span>
                          </div>
                          <h4>{j.name}</h4>
                          <p className="shop-area">{j.area}</p>
                          <p className="shop-review"><span aria-hidden="true">★★★★★</span> {j.rating} <small>({j.reviews} opiniones ilustrativas)</small></p>
                          <p className="shop-description">{j.desc}</p>
                          <div className="shop-amount">
                            <small>Precio estimado de compra</small>
                            <strong>{money.format(gross * j.percent)}</strong>
                          </div>
                          <button type="button" className="button button-outline shop-book" onClick={() => onChooseShop(index)}>
                            ELEGIR Y VER CITAS
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              <div className="form-footer">
                <button type="button" className="text-button" onClick={() => goToStep(1)}>← Cambiar mis piezas</button>
                <a href="#como-funciona" className="text-button">Conoce el proceso de valoración</a>
              </div>
            </div>
          )}
        </form>
      </div>
      <p className="fine-print">El cálculo online es orientativo. La propuesta definitiva depende de la revisión presencial del peso, la pureza y las condiciones de cada establecimiento.</p>
    </section>
  )
}
