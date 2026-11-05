import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { BotAvatar } from 'bot-avatars'

/**
 * Only four carefully placed characters on the home:
 * three small, contextual benefits and one thoughtful question.
 * The exact same clover plush is reused; only the middle card smiles and hops.
 * Their accessories are only meaningful symbols: magnifier, offers, check, question marks.
 * No decorative rays or filler strokes.
 * Pointer gaze and click hops are enabled on the underlying live canvas.
 */
export type StoryScene = 'explore' | 'compare' | 'choose' | 'question'

type Props = {
  scene: StoryScene
  size?: number
  className?: string
}

const YELLOW = '#FBE87A'
const GOLD = '#F8D64C'

function YellowAccent({ scene }: { scene: StoryScene }) {
  return (
    <svg className="story-character-props" viewBox="0 0 200 200" fill="none" aria-hidden="true">
      {scene === 'explore' && <>
        <circle cx="144" cy="76" r="19" stroke={YELLOW} strokeWidth="9" />
        <path d="M158 91l22 22" stroke={YELLOW} strokeWidth="11" strokeLinecap="round" />
      </>}
      {scene === 'compare' && <>
        <rect x="131" y="66" width="39" height="47" rx="7" fill={YELLOW} />
        <rect x="149" y="84" width="39" height="47" rx="7" fill={GOLD} />
        <path d="M158 100h19M158 112h12" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <path d="M47 48l7 7 13-16" stroke={YELLOW} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {scene === 'choose' && <>
        <path d="M146 82l14 14 25-31" stroke={YELLOW} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {scene === 'question' && <>
        <text x="27" y="73" fill={YELLOW} fontFamily="Fraunces, Georgia, serif" fontSize="63" fontWeight="700">?</text>
        <text x="149" y="64" fill={GOLD} fontFamily="Fraunces, Georgia, serif" fontSize="48" fontWeight="700">?</text>
      </>}
    </svg>
  )
}

export default function StoryMascot({ scene, size = 112, className = '' }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const target = root.current
    if (!target || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '140px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const botSize = Math.round(size * .72)
  const style = {
    '--story-size': `${size}px`,
    '--bot-size': `${botSize}px`,
  } as CSSProperties
  const celebrating = scene === 'compare'

  return (
    <div ref={root} className={`story-character story-character--${scene} ${className}`} style={style} aria-hidden="true">
      <div className="story-character__avatar">
        {visible && <BotAvatar
          type="clover"
          size={botSize}
          color="#d3bbdd"
          ink="#1F1B2E"
          seed={0.6}
          furLength={0.5}
          face={celebrating ? 'mouth' : undefined}
          speed={celebrating ? 1.05 : 1}
          jumpHeight={celebrating ? 30 : 26}
          interactive={true}
          jumpEvery={0}
          jumpSpin={1}
          state={celebrating ? 'working' : 'default'}
        />}
      </div>
      <YellowAccent scene={scene} />
    </div>
  )
}
