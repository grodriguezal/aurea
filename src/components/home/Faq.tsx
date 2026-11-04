import { reveal } from '../../lib/reveal.ts'
const QUESTIONS = [
  { q: '¿Tengo que vender mis joyas si las llevo a valorar?', a: 'No. Puedes conocer la valoración y decidir libremente si aceptas o no una oferta.' },
  { q: '¿Qué pasa si no sé cuánto pesan mis piezas?', a: 'No necesitas saberlo. Un establecimiento aliado puede comprobar el peso y la pureza durante la visita presencial.' },
  { q: '¿El valor que aparece online es definitivo?', a: 'No. Cualquier indicación inicial sería orientativa. La valoración y oferta definitivas requieren revisar físicamente cada pieza.' },
  { q: '¿Cómo se calcula el valor de mis joyas?', a: 'Influyen el peso, la pureza del oro, su cotización y las condiciones de compra del establecimiento. Te explicaremos qué se está midiendo y qué se está estimando.' },
  { q: '¿También ofrecen préstamos con garantía de oro?', a: 'No es un servicio disponible en esta fase. El recorrido inicial de Tilín se centra en conocer el valor y en la venta voluntaria de oro.' },
]

export default function Faq() {
  return (
    <section className="container section faq" id="preguntas">
      <div className="faq-intro" {...reveal()}>
        <p className="eyebrow"><span aria-hidden="true">✦</span> Sin letra pequeña</p>
        <h2 className="display display-lg">Preguntar también vale oro.</h2>
        <p className="lede">Queremos que te sientas seguro en cada paso. Aquí resolvemos algunas dudas habituales.</p>
      </div>
      <div className="faq-items">
        {QUESTIONS.map(({ q, a }, i) => (
          <details key={q} {...reveal(i * 80)}>
            <summary>{q}<span aria-hidden="true">+</span></summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
