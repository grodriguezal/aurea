import { useEffect, type CSSProperties } from 'react'

/**
 * Props that mark an element to fade and rise into place when it scrolls into view.
 * `delay` (ms) staggers siblings, e.g. cards in a row.
 */
export function reveal(delay = 0) {
  return { 'data-reveal': '', style: { '--reveal-delay': `${delay}ms` } as CSSProperties }
}

/** Watches every `[data-reveal]` element on the page and marks it revealed once it's on screen. */
export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.revealed)')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('revealed'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      },
      // Fire once ~40px of the element is on screen, so content peeking at the fold still appears on load.
      { rootMargin: '0px 0px -40px 0px', threshold: 0 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
