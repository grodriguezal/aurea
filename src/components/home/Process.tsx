import { reveal } from '../../lib/reveal.ts'
import stepGold from '../../assets/step-gold.png'
import stepYellow from '../../assets/step-yellow.jpg'
import { SquareBot } from '../Characters.tsx'

/** Staggered cards from the Figma "Así de sencillo" section; `tone` sets the background and text colour. */
const STEPS = [
  { tone: 'gold', title: 'Conoce el valor', body: 'Desde tu celular, indica el tipo de piezas, su peso y los quilates. Explora su valor orientativo.' },
  { tone: 'light', title: 'Encuentra tu momento', body: 'Compara propuestas y elige en el calendario el día y la hora que mejor te vengan.' },
  { tone: 'yellow', title: 'Visita la joyería', body: 'En la joyería, el profesional revisa contigo las piezas, el peso y la pureza del oro.' },
  { tone: 'dark', title: 'Elige con confianza', body: 'Conoce la propuesta final y decide libremente si la aceptas. Tu oro sigue siendo tuyo.' },
] as const

const BACKGROUNDS: Partial<Record<(typeof STEPS)[number]['tone'], string>> = { gold: stepGold, yellow: stepYellow }

export default function Process() {
  return (
    <section className="section process" id="como-funciona">
      <div className="container section-head">
        <p className="eyebrow" {...reveal()}><span aria-hidden="true">✦</span> Así de sencillo</p>
        <h2 className="display display-lg" {...reveal(80)}>Tu oro, en buenas manos.<br />De principio a fin.</h2>
      </div>
      <ol className="process-steps">
        {STEPS.map((s, i) => (
          <li className={`process-step process-step-${s.tone}`} key={s.title} {...reveal(i * 120)}>
            {BACKGROUNDS[s.tone] && <img className="process-step-bg" src={BACKGROUNDS[s.tone]} alt="" />}
            <span className="process-badge">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            {s.tone === 'light' && <SquareBot className="process-bot" />}
          </li>
        ))}
      </ol>
    </section>
  )
}
