import logoAccent from '../assets/logo-accent.svg'

type LogoProps = {
  className?: string
  /** Full brand lockup for hero and footer; omit for compact navigation. */
  withClaim?: boolean
}

/**
 * Keep the approved TILIN wordmark and yellow accent intact.
 * Only the full-size brand lockup includes the short brand claim.
 */
export default function Logo({ className = '', withClaim = false }: LogoProps) {
  return (
    <a
      className={`logo ${withClaim ? 'logo-with-claim' : 'logo-compact'} ${className}`}
      href="#inicio"
      aria-label={withClaim ? 'Tilín. El oro se mueve. Volver al inicio' : 'Tilín, volver al inicio'}
    >
      <span className="logo-wordmark">
        TILIN
        <img className="logo-accent" src={logoAccent} width={11.6914} height={13.75} alt="" />
      </span>
      {withClaim && <span className="logo-claim">El oro se mueve.</span>}
    </a>
  )
}
