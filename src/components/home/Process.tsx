import { reveal } from '../../lib/reveal.ts'
import stepGold from '../../assets/step-gold.png'
import stepYellow from '../../assets/step-yellow.jpg'

const STEPS = [
  { tone: 'gold', title: 'Cuéntanos lo que tienes', body: 'Escoge las piezas que quieres vender e indica su peso y los quilates. Te daremos un precio orientativo de su valor.' },
  { tone: 'light', title: 'Explora tus opciones', body: 'Compara joyerías según lo que más te importa: precio, cercanía o su reputación.' },
  { tone: 'yellow', title: 'Comprueba en persona', body: 'Haz una cita para visitar la joyería. Allí un profesional certificado verificará contigo el peso y la pureza del oro de tu pieza.' },
  { tone: 'dark', title: 'Tú tienes la última palabra', body: 'Con la propuesta definitiva sobre la mesa, tú decides si vendes. Si no te convence, te llevas tus piezas.' },
] as const

const BACKGROUNDS: Partial<Record<(typeof STEPS)[number]['tone'], string>> = { gold: stepGold, yellow: stepYellow }

export default function Process() {
  return (
    <section className="section process" id="como-funciona">
      <div className="container section-head">
        <p className="eyebrow" {...reveal()}><span aria-hidden="true">✦</span> Así funciona Tilín</p>
        <h2 className="display display-lg" {...reveal(80)}>De la primera pregunta<br className="br-desktop" /> a la última palabra.</h2>
      </div>
      <ol className="process-steps">
        {STEPS.map((s, i) => (
          <li className={`process-step process-step-${s.tone}`} key={s.title} {...reveal(i * 120)}>
            {BACKGROUNDS[s.tone] && <img className="process-step-bg" src={BACKGROUNDS[s.tone]} alt="" />}
            <span className="process-badge">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
