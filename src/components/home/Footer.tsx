import { reveal } from '../../lib/reveal.ts'
import Logo from '../Logo.tsx'

const YEAR = new Date().getFullYear()

export default function SiteFooter() {
  return (
    <footer className="site-footer" {...reveal()}>
      <div className="footer-main">
        <Logo className="footer-logo" />
        <p>Conoce cuánto podrían ofrecerte por tu oro, compara joyerías y decide con información.</p>
        <nav className="footer-links" aria-label="Enlaces del sitio">
          <a href="#comparar">Compara</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#cita">Citas</a>
          <a href="#preguntas">Preguntas</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <small>© {YEAR} Tilín. El oro no se guarda, se mueve.</small>
        <small>Versión de demostración · Precios orientativos · Sin reservas reales</small>
      </div>
    </footer>
  )
}
