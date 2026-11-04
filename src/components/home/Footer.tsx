import { reveal } from '../../lib/reveal.ts'
import Logo from '../Logo.tsx'

const YEAR = new Date().getFullYear()

export default function SiteFooter() {
  return (
    <footer className="site-footer" {...reveal()}>
      <div className="footer-main">
        <Logo className="footer-logo" />
        <p>Una forma más clara y cercana de conocer el valor de tu oro.</p>
        <nav className="footer-links" aria-label="Enlaces del sitio">
          <a href="#cita">Haz una cita</a>
          <a href="#como-funciona">Cómo funciona</a>
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
