import { useState } from 'react'
import chevron from '../../assets/chevron.svg'
import { reveal } from '../../lib/reveal.ts'

/** Questions shown before "Ver más". */
const VISIBLE = 4

const QUESTIONS = [
  { q: '¿Tilín me compra el oro?', a: 'No. Tilín te ayuda a conocer precios orientativos, comparar opciones y encontrar joyerías. La compra, si decides hacerla, se realiza directamente con el establecimiento.' },
  { q: '¿El precio que aparece online es definitivo?', a: 'No. Es una estimación basada en la información que proporcionas y las referencias disponibles. La joyería comprueba el peso y la pureza y te presenta la propuesta definitiva en persona.' },
  { q: '¿Qué pasa si no sé el peso o los quilates?', a: 'Puedes continuar con tu consulta. Cuando falten datos, Tilín podrá mostrar un rango o referencias por gramo. La comprobación exacta se realiza presencialmente.' },
  { q: '¿Es obligatorio vender después de la valoración?', a: 'En absoluto. Puedes escuchar la propuesta y decidir que no. Tus piezas siguen siendo tuyas hasta que aceptes una venta.' },
  { q: '¿Por qué el precio de compra puede ser distinto del valor del oro?', a: 'La cotización internacional es una referencia para el metal puro. El precio que ofrece cada joyería también depende de la pureza de tus piezas y de sus propias condiciones de compra.' },
  { q: '¿Son reales las joyerías y los horarios que aparecen?', a: 'En esta versión son ejemplos para mostrar cómo funcionará la comparación. Los precios, las reseñas y los horarios no son ofertas reales y la selección de una cita no constituye una reserva confirmada.' },
  { q: '¿Para qué me piden mi WhatsApp?', a: 'En la experiencia actual se utiliza para acceder y continuar tu consulta. El acceso se está probando: todavía no se envían mensajes reales ni confirmaciones de citas.' },
]

export default function Faq() {
  const [expanded, setExpanded] = useState(false)
  return (
    <section className="container section faq" id="preguntas">
      <div className="faq-intro" {...reveal()}>
        <p className="eyebrow"><span aria-hidden="true">✦</span> Dudas claras, respuestas claras</p>
        <h2 className="display display-lg">Preguntar también vale oro.</h2>
        <p className="lede">Antes de vender, es normal tener preguntas. Queremos que entiendas cómo funciona todo, sin letra pequeña.</p>
      </div>
      <div className="faq-items" id="faqItems">
        {QUESTIONS.map(({ q, a }, i) => (
          // Extra questions stay mounted but hidden, so the scroll reveal still animates them in once shown.
          <details key={q} hidden={!expanded && i >= VISIBLE} {...reveal((i % VISIBLE) * 80)}>
            <summary>{q}<span aria-hidden="true">+</span></summary>
            <p>{a}</p>
          </details>
        ))}
        {QUESTIONS.length > VISIBLE && (
          <button type="button" className="faq-more" aria-expanded={expanded} aria-controls="faqItems" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Ver menos' : 'Ver más'}
            <img src={chevron} width={20} height={20} alt="" />
          </button>
        )}
      </div>
    </section>
  )
}
