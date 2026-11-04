import { reveal } from '../../lib/reveal.ts'
import { openSignIn, SIGNIN_HREF } from '../../lib/route.ts'
import { STORES } from '../../data/stores.ts'

// Illustration only: never present these figures as current quotes or real reviews.
const EXAMPLE_PRICES = ['US$ 670', 'US$ 651', 'US$ 632']

export function CompareSection() {
  return (
    <section className="section compare-section" id="comparar" aria-labelledby="compareTitle">
      <div className="container">
        <div className="compare-heading">
          <div {...reveal()}>
            <p className="eyebrow"><span aria-hidden="true">✦</span> Aquí está la diferencia</p>
            <h2 className="display display-lg" id="compareTitle">El mismo oro.<br /><em>Distintas ofertas.</em></h2>
          </div>
          <p {...reveal(100)}>El precio de compra puede cambiar de una joyería a otra. Tilín te ayuda a explorar alternativas para que no decidas a ciegas.</p>
        </div>
        <div className="compare-example" {...reveal(150)}>
          <div className="compare-example-head">
            <div>
              <span className="compare-kicker">ASÍ SE VERÍA UNA COMPARACIÓN</span>
              <h3>Imagina una pieza de 10 g y 18K</h3>
            </div>
            <span className="compare-demo-label">EJEMPLO ILUSTRATIVO</span>
          </div>
          <div className="compare-cards">
            {STORES.slice(0, 3).map((store, i) => (
              <article className="compare-card" key={store.id}>
                <div className="compare-card-top">
                  <span className="compare-monogram" aria-hidden="true">{store.name.replace(/^Joyería /, '').charAt(0)}</span>
                  <span className="compare-card-tag">{i === 0 ? 'Mayor precio de ejemplo' : i === 1 ? 'Otra alternativa' : 'Una opción más'}</span>
                </div>
                <h4>{store.name}</h4>
                <p className="compare-location">{store.address} · Caracas</p>
                <span className="compare-price-label">Precio de compra simulado</span>
                <strong className="compare-price">{EXAMPLE_PRICES[i]}</strong>
                <p className="compare-review"><span aria-hidden="true">★</span> {store.rating.toLocaleString('es-VE', { minimumFractionDigits: 1 })} · {store.reviews} opiniones de ejemplo</p>
              </article>
            ))}
          </div>
          <p className="compare-disclaimer">Estos nombres, precios, ubicaciones y opiniones son ficticios. No son cotizaciones ni ofertas reales; ilustran cómo podrás comparar joyerías en Tilín.</p>
        </div>
        <div className="compare-action" {...reveal(220)}>
          <div><strong>Una consulta. Más opciones para decidir.</strong><p>Empieza contándole a Tilín qué piezas tienes.</p></div>
          <a className="button button-dark" href={SIGNIN_HREF} onClick={openSignIn}>EXPLORAR MIS OPCIONES</a>
        </div>
      </div>
    </section>
  )
}

export function ConfidenceSection() {
  return (
    <section className="section confidence-section" id="confianza">
      <div className="container confidence-panel" {...reveal()}>
        <div>
          <p className="eyebrow"><span aria-hidden="true">✦</span> Antes de decidir</p>
          <h2 className="display display-lg">Tu oro es tuyo.<br />La decisión también.</h2>
        </div>
        <div className="confidence-copy">
          <p><strong>Tilín no te compra el oro.</strong> Te ayuda a orientarte y a comparar joyerías. El precio que ves inicialmente es una estimación, no una oferta definitiva.</p>
          <p>Cuando visitas el establecimiento, comprueban contigo el peso y los quilates. Entonces conoces la propuesta final y decides si la aceptas. Sin obligación de vender.</p>
          <a href="#preguntas" className="confidence-link">Resuelve tus dudas <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  )
}

export function ClosingSection() {
  return (
    <section className="section closing-section" aria-labelledby="closingTitle">
      <div className="container closing-content" {...reveal()}>
        <p className="eyebrow"><span aria-hidden="true">✦</span> El siguiente paso es tuyo</p>
        <h2 className="display display-lg" id="closingTitle">No tienes que vender hoy.<br />Puedes empezar por saber.</h2>
        <p>Conoce cuánto podrían pagarte por tu oro y descubre qué opciones tienes antes de elegir una joyería.</p>
        <a className="button button-dark" href={SIGNIN_HREF} onClick={openSignIn}>EMPEZAR MI CONSULTA</a>
        <small>La consulta no te compromete a vender. En esta versión, las joyerías y las reservas son de demostración.</small>
      </div>
    </section>
  )
}
