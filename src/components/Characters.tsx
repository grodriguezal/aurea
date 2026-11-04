import { BotAvatar } from 'bot-avatars'
import blobCrown from '../assets/blob-crown.png'
import blobDots from '../assets/blob-dots.png'
import crownMark from '../assets/crown.svg'
import dotsTrail from '../assets/dots-trail.svg'

/** Rendered body size of the live avatars, matched to the Figma characters' visible blob. */
const BOT_SIZE = 180

interface Props {
  className?: string
}

/** Live clover avatar (no idle jumps). */
export function CloverBot({ className = '' }: Props) {
  return (
    <div className={`character character-bot ${className}`} aria-hidden="true">
      <BotAvatar type="clover" size={BOT_SIZE} color="#d3bbdd" ink="#1F1B2E" seed={0.6} furLength={0.5} jumpSpin={0} jumpEvery={0} />
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
export function DotsBot({ className = '' }: Props) {
  return (
    <div className={`character character-bot character-dots ${className}`} aria-hidden="true">
      <BotAvatar type="blob" size={BOT_SIZE} color="#d7bde3" seed={0.6} furLength={0.5} jumpEvery={0} />
      <img className="character-dots-mark" src={dotsTrail} width={142.29} height={120.318} alt="" />
    </div>
  )
}

/** Static Figma artwork, used outside the hero area. */
export function CrownPlush({ className = '' }: Props) {
  return (
    <div className={`character character-crown ${className}`} aria-hidden="true">
      <img className="character-body" src={blobCrown} width={372} height={372} alt="" />
      <img className="character-crown-mark" src={crownMark} width={53.8862} height={41.454} alt="" />
    </div>
  )
}

export function DotsPlush({ className = '' }: Props) {
  return (
    <div className={`character character-dots ${className}`} aria-hidden="true">
      <img className="character-body" src={blobDots} width={372} height={372} alt="" />
      <img className="character-dots-mark" src={dotsTrail} width={142.29} height={120.318} alt="" />
    </div>
  )
}
