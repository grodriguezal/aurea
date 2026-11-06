import { reveal } from '../../lib/reveal.ts'
import { openSignIn, SIGNIN_HREF } from '../../lib/route.ts'
import heroUnion from '../../assets/hero-union.svg'
import { YellowAccent, type StoryScene } from '../StoryMascot.tsx'
import { BotAvatar, type BotAvatarProps } from 'bot-avatars'
import Logo from '../Logo.tsx'

const PROMISES: { title: string, body: string, scene: StoryScene, mascot: BotAvatarProps }[] = [
  { title: 'Conoce su valor', body: 'Explora un precio estimado con el peso, los quilates y la cotización del oro.', scene: 'explore', mascot: { type: 'clover', color: '#d3bbdd', ink: '#1F1B2E', jumpSpin: 0 } },
  { title: 'Compara joyerías', body: 'Descubre cómo comparar alternativas de distintas joyerías en un solo lugar.', scene: 'compare', mascot: { type: 'circle', color: '#cfc1e9', jumpEvery: 0 } },
  { title: 'Tú decides', body: 'Conoces la oferta final en persona. Aceptarla o no depende de ti.', scene: 'choose', mascot: { type: 'blob', color: '#d7bde3', jumpEvery: 0 } },
]

export default function Intro() {
  return (
    <div className="intro" id="inicio">
      <header className="hero">
        <Logo className="hero-logo" />
        <div className="hero-content">
          <p className="hero-tagline">¿Quieres vender oro? Descubre cuánto podrían pagarte y compara joyerías sin dar vueltas.</p>
          <h1 className="hero-title">
            <span className="visually-hidden">El oro no se guarda, se mueve</span>
            <span className="pill-headline" aria-hidden="true">
              <span className="pill pill-el-oro" />
              <span className="pill pill-no" />
              <span className="pill-union-glass" />
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
          <a className="button button-yellow button-shadow" href={SIGNIN_HREF} onClick={openSignIn}>CONSULTA EL VALOR DE TU ORO</a>
        </div>
      </header>

      <section className="container promise-grid" aria-label="Las ventajas de Tilín">
        {PROMISES.map((p, i) => (
          <article className="card promise-story-card" key={p.title} {...reveal(400 + i * 110)}>
            <span className={`promise-mascot promise-mascot--${p.scene}`} aria-hidden="true">
              <BotAvatar {...p.mascot} size={112} furLength={0.5} />
              <YellowAccent scene={p.scene} />
            </span>
            <div className="promise-story-copy"><h2>{p.title}</h2><p>{p.body}</p></div>
          </article>
        ))}
      </section>
    </div>
  )
}
