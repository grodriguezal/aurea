const STEPS = [
  { title: 'Conoce el valor', body: 'Desde tu ordenador, indica el tipo de piezas, su peso y los quilates. Explora su valor orientativo.' },
  { title: 'Encuentra tu momento', body: 'Compara propuestas y elige en el calendario el día y la hora que mejor te vengan.' },
  { title: 'Visita una joyería', body: 'En la joyería, el profesional revisa contigo las piezas, el peso y la pureza del oro.' },
  { title: 'Elige con confianza', body: 'Conoce la propuesta final y decide libremente si la aceptas. Tu oro sigue siendo tuyo.' },
]

const VISIT = [
  { title: 'Llevas tus piezas', body: 'Acude el día elegido con tus joyas y la documentación que te solicite la joyería.' },
  { title: 'Revisan el oro contigo', body: 'Se comprueba el peso, la pureza y el estado de las piezas delante de ti.' },
  { title: 'Tú tienes la última palabra', body: 'Te explican la oferta final. Puedes aceptarla o marcharte con tus joyas.' },
]

const badge = (i: number) => String(i + 1).padStart(2, '0')

export function Process() {
  return (
    <section className="container section" id="como-funciona">
      <div className="section-head">
        <p className="eyebrow"><span aria-hidden="true">✦</span> Así de sencillo</p>
        <h2 className="display display-md">Tu oro, en buenas manos.<br />De principio a fin.</h2>
        <p className="lede">Un proceso claro para que sepas qué esperar en cada momento.</p>
      </div>
      <div className="process-grid">
        {STEPS.map((s, i) => (
          <article className="card" key={s.title}>
            <span className="step-badge">{badge(i)}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Visit() {
  return (
    <section className="visit" aria-labelledby="visitHeading">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow eyebrow-dark"><span aria-hidden="true">✦</span> Al llegar a la joyería</p>
          <h2 className="display display-md" id="visitHeading">¿Qué ocurre en tu visita?</h2>
          <p className="lede">No necesitas preparar nada complicado. El profesional te acompaña en cada paso.</p>
        </div>
        <div className="visit-grid">
          {VISIT.map((s, i) => (
            <article className="card card-white" key={s.title}>
              <span className="step-badge step-badge-dark">{badge(i)}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
