import { reveal } from '../../lib/reveal.ts'
import goldTexture from '../../assets/gold-texture.jpg'
import StoryMascot from '../StoryMascot.tsx'

export default function ValueSection() {
  return (
    <section className="value" id="conoce-tu-oro">
      <div className="container value-copy">
        <p className="eyebrow" {...reveal()}><span aria-hidden="true">✦</span> La pregunta que todos nos hacemos</p>
        <h2 className="display display-lg" {...reveal(80)}>¿Y cuánto te pagarían a ti?</h2>
        <div className="value-text" {...reveal(160)}>
          <p>Un anillo que ya no usas. Una cadena guardada. Unos zarcillos que llevan años en un cajón. Sabes qué tienes, pero no cuánto podrían ofrecerte por ello.</p>
          <p>El peso, los quilates y la cotización influyen en su valor. <strong>Y el precio de compra puede ser distinto en cada joyería.</strong> Por eso, antes de vender, vale la pena comparar.</p>
        </div>
        <a className="button button-dark" href="#comparar" {...reveal(240)}>MIRA POR QUÉ COMPARAR IMPORTA</a>
      </div>
      <div className="value-art" aria-hidden="true">
        <span className="value-square" {...reveal(150)} />
        <img className="value-photo" {...reveal(300)} src={goldTexture} width={426} height={639} alt="" />
        <StoryMascot scene="question" size={162} className="value-question-character" />
      </div>
    </section>
  )
}
