import { useEffect, useRef, useState, type ReactNode } from 'react'

const EXIT_MS = 320

interface Props {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
}

/** Side panel over a dimmed page. Esc or a click on the backdrop closes it; it stays mounted while sliding out. */
export default function Drawer({ open, onClose, label, children }: Props) {
  const [rendered, setRendered] = useState(open)
  if (open && !rendered) setRendered(true)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open || !rendered) return
    const t = setTimeout(() => setRendered(false), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : EXIT_MS)
    return () => clearTimeout(t)
  }, [open, rendered])

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
      opener?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  if (!rendered) return null
  return (
    <div className="drawer" data-state={open ? 'open' : 'closed'}>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="drawer-panel" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} ref={panelRef}>
        {children}
      </div>
    </div>
  )
}

/** Close (×) button for drawer headers. */
export function DrawerClose({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" className="drawer-close" aria-label="Cerrar" onClick={onClose}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
    </button>
  )
}
