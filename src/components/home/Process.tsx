import { reveal } from '../../lib/reveal.ts'
import stepGold from '../../assets/step-gold.png'
import stepYellow from '../../assets/step-yellow.jpg'
import { SquareBot } from '../Characters.tsx'

const STEPS = [
  { tone: 'gold', title: 'Cuéntanos qué tienes', body: 'Elige tus piezas e indica el peso y los quilates aproximados. Si no sabes alguno de esos datos, también puedes avanzar.' },
  { tone: 'light', title: 'Explora tus opciones', body: 'Conoce un precio orientativo y compara joyerías según lo que más te importa: precio, cercanía o reputación.' },
  { tone: 'yellow', title: 'Comprueba en persona', body: 'Elige un momento para visitar la joyería. Allí verificarán contigo el peso y la pureza de tu oro.' },
  { tone: 'dark', title: 'Tú tienes la última palabra', body: 'Con la propuesta definitiva sobre la mesa, decides si vendes. Si no te convence, te llevas tus piezas.' },
] as const

const BACKGROUNDS: Partial<Record<(typeof STEPS)[number]['tone'], string>> = { gold: stepGold, yellow: stepYellow }

export default function Process() {
  return (
    <section className="section process" id="como-funciona">
      <div className="container section-head">
        <p className="eyebrow" {...reveal()}><span aria-hidden="true">✦</span> Así funciona Tilín</p>
        <h2 className="display display-lg" {...reveal(80)}>De la primera pregunta<br />a la última palabra.</h2>
        <p className="process-lede" {...reveal(150)}>Sin recorrer varias joyerías para empezar a entender tus opciones.</p>
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
