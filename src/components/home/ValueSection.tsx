import { reveal } from '../../lib/reveal.ts'
import { SIGNIN_HREF } from '../../lib/route.ts'
import goldTexture from '../../assets/gold-texture.jpg'

export default function ValueSection() {
  return (
    <section className="value" id="conoce-tu-oro">
      <div className="container value-copy">
        <p className="eyebrow" {...reveal()}><span aria-hidden="true">✦</span> Tu oro tiene valor</p>
        <h2 className="display display-lg" {...reveal(80)}>Hay algo valioso<br />en lo que ya tienes!</h2>
        <div className="value-text" {...reveal(160)}>
          <p>Ese anillo que ya no usas. Una cadena olvidada. Unos pendientes que guardaste hace años.</p>
          <p>En <strong>Tilín</strong> te ayudamos a conocer el valor de tus piezas y a entender tus opciones con transparencia, sin prisas y sin obligación de vender.</p>
        </div>
        <a className="button button-dark" href={SIGNIN_HREF} {...reveal(240)}>VER MIS OPCIONES</a>
      </div>
      <div className="value-art" aria-hidden="true">
        <span className="value-square" {...reveal(150)} />
        <img className="value-photo" {...reveal(300)} src={goldTexture} width={426} height={639} alt="" />
      </div>
    </section>
  )
}
