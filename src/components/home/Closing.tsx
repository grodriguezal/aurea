import { SIGNIN_HREF } from '../../lib/route.ts'
import { CrownPlush } from '../Characters.tsx'
import Logo from '../Logo.tsx'

const YEAR = new Date().getFullYear()

export function Closing() {
  return (
    <section className="closing" aria-labelledby="closingHeading">
      <div className="closing-content">
        <p className="eyebrow eyebrow-dark"><span aria-hidden="true">✦</span> El oro no se guarda, se mueve</p>
        <h2 className="display" id="closingHeading">Tu oro puede abrir<br />nuevas posibilidades.</h2>
        <p className="lede">El primer paso es descubrirlas.</p>
        <a className="button button-dark" href={SIGNIN_HREF}>CALCULA EL VALOR DE TU ORO</a>
      </div>
      <CrownPlush className="character-closing" />
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Logo className="footer-logo" />
        <p>Una forma más clara y cercana de conocer el valor de tu oro.</p>
        <nav className="footer-links" aria-label="Enlaces del sitio">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#valoracion">Conoce tus piezas</a>
          <a href="#cita">Haz una cita</a>
          <a href="#preguntas">Preguntas</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <small>© {YEAR} Tilín. El oro no se guarda, se mueve.</small>
        <small>Información orientativa · Valoración presencial sujeta a verificación</small>
      </div>
    </footer>
  )
}
