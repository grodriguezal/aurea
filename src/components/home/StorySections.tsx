import { useState } from 'react'
import { reveal } from '../../lib/reveal.ts'
import { openSignIn, SIGNIN_HREF } from '../../lib/route.ts'
import { STORES } from '../../data/stores.ts'
import StoreCardGroup from '../StoreCards.tsx'

// Illustration only: never present these figures as current quotes or real reviews.
const EXAMPLE_PRICES = ['US$ 670', 'US$ 651', 'US$ 632']
// Same wording as the chat's priority tags.
const EXAMPLE_TAGS = ['Mejor precio', 'Más cerca', 'Mejor valorada']
// Ratings for this illustration only, so the "Mejor valorada" card really has the best one.
const EXAMPLE_RATINGS = [4.6, 4.7, 4.9]

export function CompareSection() {
  const stores = STORES.slice(0, 3)
  const [selected, setSelected] = useState(0)
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
            <h3 id="compareExampleTitle">Imagina que tienes un collar de 10 gramos y 18 quilates</h3>
          </div>
          <StoreCardGroup
            className="compare-cards"
            labelledBy="compareExampleTitle"
            items={stores.map((store, i) => ({ store, tag: EXAMPLE_TAGS[i], price: EXAMPLE_PRICES[i], rating: EXAMPLE_RATINGS[i] }))}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        <div className="compare-action" {...reveal(220)}>
          <strong>Una consulta. Más opciones para decidir.</strong>
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
