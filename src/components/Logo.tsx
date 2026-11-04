import logoAccent from '../assets/logo-accent.svg'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <a className={`logo ${className}`} href="#inicio" aria-label="Tilín, volver al inicio">
      TILIN
      <img className="logo-accent" src={logoAccent} width={11.6914} height={13.75} alt="" />
    </a>
  )
}
