import { reveal } from '../../lib/reveal.ts'
import { openSignIn, SIGNIN_HREF } from '../../lib/route.ts'
import heroUnion from '../../assets/hero-union.svg'
import { CloverBot, DotsBot } from '../Characters.tsx'
import Logo from '../Logo.tsx'

const PROMISES = [
  { title: 'Conoce el valor', body: 'Cuéntanos qué tipo de piezas tienes y te damos un precio orientativo.' },
  { title: 'Haz una cita', body: 'Compara las distintas ofertas, y escoge el comprador según tus preferencias.' },
  { title: 'Elige con confianza', body: 'Conoce la propuesta final y decide si la aceptas. Tu oro sigue siendo tuyo.' },
]

export default function Intro() {
  return (
    <div className="intro" id="inicio">
      <header className="hero">
        <Logo className="hero-logo" />
        <div className="hero-content">
          <p className="hero-tagline">Trae tu oro. Sal con efectivo. Rápido, justo y sin comisiones.</p>
          <h1 className="hero-title">
            <span className="visually-hidden">El oro no se guarda, se mueve</span>
            <span className="pill-headline" aria-hidden="true">
              <span className="pill pill-el-oro" />
              <span className="pill pill-no" />
              <img className="pill-union" src={heroUnion} width={279.693} height={188.343} alt="" />
              <span className="pill pill-guarda" />
              <span className="pill pill-mueve" />
              <span className="pill-word word-el-oro">El oro</span>
              <span className="pill-word word-no">no</span>
              <span className="pill-word pill-word-tall word-se-1">se</span>
              <span className="pill-word pill-word-tall word-guarda">guarda</span>
              <span className="pill-word word-se-2">se</span>
              <span className="pill-word word-mueve">mueve</span>
            </span>
          </h1>
          <a className="button button-yellow button-shadow" href={SIGNIN_HREF} onClick={openSignIn}>CALCULA EL VALOR DE TU ORO</a>
        </div>
      </header>

      <CloverBot className="intro-crown" />

      <section className="container promise-grid" aria-label="Cómo te ayudamos">
        {PROMISES.map((p, i) => (
          <article className="card" key={p.title} {...reveal(900 + i * 110)}>
            <h2>{p.title}</h2>
            <p>{p.body}</p>
          </article>
        ))}
      </section>

      <DotsBot className="intro-dots" {...reveal(200)} />
    </div>
  )
}
