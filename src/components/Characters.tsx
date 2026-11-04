import { BotAvatar } from 'bot-avatars'
import type { HTMLAttributes } from 'react'
import dotsTrail from '../assets/dots-trail.svg'

/** Rendered body size of the live avatars, matched to the Figma characters' visible blob. */
const BOT_SIZE = 180

type Props = HTMLAttributes<HTMLDivElement>

/** Live clover avatar (no idle jumps). */
export function CloverBot({ className = '', ...rest }: Props) {
  return (
    <div {...rest} className={`character character-bot ${className}`} aria-hidden="true">
      <BotAvatar type="clover" size={BOT_SIZE} color="#d3bbdd" ink="#1F1B2E" seed={0.6} furLength={0.5} jumpSpin={0} jumpEvery={0} />
    </div>
  )
}

/** Live square plush from the "Así de sencillo" cards. */
export function SquareBot({ className = '', ...rest }: Props) {
  return (
    <div {...rest} className={`character character-bot ${className}`} aria-hidden="true">
      <BotAvatar type="square" size={210} color="#b9a6e8" saturation={1.1} ink="#1F1B2E" seed={0.3} furLength={0.5} jumpEvery={0} />
    </div>
  )
}

/** Chat mascot: the hero's clover, small, busy while Tilín is thinking. */
export function ChatMascot({ working, size = 36 }: { working: boolean; size?: number }) {
  return (
    <BotAvatar
      type="clover"
      size={size}
      color="#d3bbdd"
      ink="#1F1B2E"
      seed={0.6}
      furLength={0.5}
      jumpEvery={0}
      state={working ? 'working' : 'default'}
      aria-label={working ? 'Tilín está pensando' : 'Tilín'}
    />
  )
}

/** Live blob avatar with the Figma dotted trail layered over it. */
export function DotsBot({ className = '', ...rest }: Props) {
  return (
    <div {...rest} className={`character character-bot character-dots ${className}`} aria-hidden="true">
      <BotAvatar type="blob" size={BOT_SIZE} color="#d7bde3" seed={0.6} furLength={0.5} jumpEvery={0} />
      <img className="character-dots-mark" src={dotsTrail} width={142.29} height={120.318} alt="" />
    </div>
  )
}
