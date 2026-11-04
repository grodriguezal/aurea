import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { BotAvatar } from 'bot-avatars'

/**
 * Contextual scenes for the existing Tilín mascot family.
 * The expressive purple avatars are the same bot-avatars characters used in the hero and chat.
 * Jewellery, magnifiers, comparison cards and symbols are crisp SVG overlays, not enlarged bitmaps.
 */
export type StoryScene =
  | 'explore' | 'compare' | 'choose' | 'question' | 'pieces'
  | 'offers' | 'verify' | 'decision' | 'calendar' | 'reassure' | 'invite'

type Props = {
  scene: StoryScene
  size?: number
  className?: string
}

const ink = '#424040'
const gold = '#F5BD33'
const paper = '#FFFDF4'

function SceneProps({ scene }: { scene: StoryScene }) {
  const common = { stroke: ink, strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg className="story-character-props" viewBox="0 0 220 220" fill="none" aria-hidden="true">
      {scene === 'explore' && <>
        <circle cx="166" cy="82" r="27" fill={paper} {...common} />
        <path d="M186 102l23 24" {...common} strokeWidth="8" />
        <path d="M153 78l12-10 14 10-14 16-12-16z" fill={gold} {...common} strokeWidth="2.5" />
        <path d="M48 55v-18M39 46h18M185 37v-13M178 31h14" stroke={gold} strokeWidth="5" strokeLinecap="round" />
      </>}
      {scene === 'compare' && <>
        <rect x="120" y="63" width="63" height="87" rx="11" fill={paper} {...common} />
        <rect x="145" y="80" width="64" height="87" rx="11" fill="#FBE87A" {...common} />
        <path d="M158 107h37M158 123h25M158 140h32" {...common} strokeWidth="3" />
        <path d="M127 86h13M127 100h13M127 114h12" stroke={gold} strokeWidth="5" strokeLinecap="round" />
        <path d="M43 54l8 8 15-18" stroke="#6E8F65" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {scene === 'choose' && <>
        <path d="M156 64l13-7 13 7v13c0 13-11 21-13 22-2-1-13-9-13-22V64z" fill="#FBE87A" {...common} strokeWidth="3" />
        <path d="M161 77l6 6 10-13" stroke="#41764A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="158" cy="166" rx="29" ry="18" fill={gold} {...common} strokeWidth="3" />
        <path d="M158 157c-8 0-13 4-13 9s5 9 13 9 13-4 13-9-5-9-13-9z" stroke="#8C6500" strokeWidth="2.5" />
        <path d="M49 52l7-7M174 36l7-7" stroke={gold} strokeWidth="4" strokeLinecap="round" />
      </>}
      {scene === 'question' && <>
        <text x="26" y="70" fill={ink} fontFamily="Georgia, serif" fontSize="62" fontWeight="bold">?</text>
        <text x="160" y="66" fill="#A47A18" fontFamily="Georgia, serif" fontSize="49" fontWeight="bold">?</text>
        <path d="M152 129l8 8 18-18M41 115l-6 9 9 7" stroke={gold} strokeWidth="4" strokeLinecap="round" />
        <path d="M147 163c12-8 27-9 42-3" stroke={ink} strokeWidth="3" strokeDasharray="3 8" strokeLinecap="round" />
      </>}
      {scene === 'pieces' && <>
        <circle cx="164" cy="160" r="24" fill={paper} {...common} />
        <path d="M150 141l14-17 14 17-14 13-14-13z" fill={gold} {...common} strokeWidth="3" />
        <path d="M150 141l14 13 14-13" stroke="#BA860E" strokeWidth="2" />
        <path d="M41 72c-3-14 6-22 13-22s16 8 13 22" stroke={ink} strokeWidth="3" />
        <path d="M41 72a13 13 0 0 0 26 0" stroke={ink} strokeWidth="3" />
        <circle cx="54" cy="83" r="6" fill={gold} />
      </>}
      {scene === 'offers' && <>
        <rect x="137" y="54" width="58" height="69" rx="9" fill={paper} {...common} strokeWidth="3" />
        <rect x="155" y="91" width="56" height="68" rx="9" fill="#FBE87A" {...common} strokeWidth="3" />
        <path d="M147 68h36M147 82h25M165 107h32M165 121h24M165 137h30" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <path d="M40 60l10 9 18-20" stroke="#588957" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {scene === 'verify' && <>
        <path d="M26 174h169" stroke={ink} strokeWidth="5" strokeLinecap="round" />
        <rect x="72" y="159" width="78" height="14" rx="7" fill="#FBE87A" {...common} strokeWidth="3" />
        <path d="M99 158l11-21 11 21" fill={gold} {...common} strokeWidth="3" />
        <path d="M163 87l16-18" stroke={ink} strokeWidth="7" strokeLinecap="round" />
        <circle cx="157" cy="93" r="16" fill="#FFFDF4" stroke={ink} strokeWidth="4" />
        <path d="M34 70l9 9 14-16" stroke="#588957" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {scene === 'decision' && <>
        <path d="M144 62h51a9 9 0 0 1 9 9v57a9 9 0 0 1-9 9h-51a9 9 0 0 1-9-9V71a9 9 0 0 1 9-9z" fill={paper} {...common} strokeWidth="3.5" />
        <path d="M151 98l11 11 25-29" stroke="#48824B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M145 157l14-11 15 11-15 12-14-12z" fill={gold} {...common} strokeWidth="3" />
        <circle cx="52" cy="64" r="9" fill={gold} />
      </>}
      {scene === 'calendar' && <>
        <rect x="124" y="48" width="84" height="89" rx="11" fill={paper} {...common} strokeWidth="3.5" />
        <path d="M125 75h82" stroke={ink} strokeWidth="3.5" />
        <path d="M145 39v20M187 39v20" stroke={ink} strokeWidth="5" strokeLinecap="round" />
        <rect x="143" y="90" width="17" height="16" rx="3" fill={gold} />
        <path d="M173 98h17M146 121h41" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <path d="M164 156l11 10 18-21" stroke="#588957" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {scene === 'reassure' && <>
        <path d="M172 77c-12-17-38 0-22 17l22 23 21-23c16-17-10-34-21-17z" fill="#FBE87A" {...common} strokeWidth="3" />
        <circle cx="157" cy="154" r="26" fill={gold} {...common} strokeWidth="3" />
        <circle cx="157" cy="154" r="17" stroke="#9D7418" strokeWidth="3" />
        <path d="M40 65l9 9 16-21" stroke="#588957" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {scene === 'invite' && <>
        <path d="M136 128c20 0 37-7 56-28" stroke={ink} strokeWidth="4" strokeDasharray="5 9" strokeLinecap="round" />
        <path d="M179 96l16 1-2 17" stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M162 50v-17M153 42h18" stroke={gold} strokeWidth="6" strokeLinecap="round" />
        <path d="M56 65v-14M49 58h14" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <circle cx="185" cy="153" r="19" fill={gold} {...common} strokeWidth="3" />
      </>}
    </svg>
  )
}

export default function StoryMascot({ scene, size = 180, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setReady(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setReady(true)
        observer.disconnect()
      }
    }, { rootMargin: '180px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  const botSize = Math.round(size * (scene === 'verify' ? .48 : .69))
  const style = {
    '--story-size': `${size}px`,
    '--bot-size': `${botSize}px`,
  } as CSSProperties
  return (
    <div ref={ref} className={`story-character story-character--${scene} ${className}`} style={style} aria-hidden="true">
      <div className="story-character__avatar">
        {ready && <BotAvatar
          type={scene === 'compare' || scene === 'offers' || scene === 'calendar' ? 'square' : 'clover'}
          size={botSize}
          color={scene === 'compare' || scene === 'offers' || scene === 'calendar' ? '#b9a6e8' : '#d3bbdd'}
          ink="#1F1B2E"
          seed={0.6}
          furLength={0.5}
          jumpEvery={0}
          jumpSpin={0}
          state={scene === 'question' || scene === 'explore' ? 'working' : 'default'}
        />}
        {scene === 'verify' && ready && <BotAvatar
          type="square"
          size={botSize}
          color="#b9a6e8"
          ink="#1F1B2E"
          seed={0.3}
          furLength={0.5}
          jumpEvery={0}
        />}
      </div>
      <SceneProps scene={scene} />
    </div>
  )
}
