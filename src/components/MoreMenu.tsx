import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTemporaryState } from '../hooks/useTemporaryState'
import { copyText } from '../utils/copyText'
import {
  CloseIcon,
  MoreIcon,
  MoonIcon,
  ShareIcon,
  SunIcon,
} from './ui/icons'

type MoreMenuProps = {
  isDark: boolean
  onToggleTheme: () => void
  showToast: (message: string) => void
}

// A hard outline keeps the rigid, square-edged look while staying legible on
// both the blue trigger and the light/dark drawer surfaces.
const FOCUS =
  'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue dark:focus-visible:outline-brand-sky'

// Remove the double-tap zoom delay and the default blue tap flash on touch.
const TOUCH = 'touch-manipulation [-webkit-tap-highlight-color:transparent]'

// Both drawer actions share one hit target, type treatment and border weight.
// The extra padding keeps labels clear of the hard borders and offset shadows.
const ACTION =
  'flex min-h-12 w-full cursor-pointer items-center rounded-md border-2 border-slate-950 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors motion-reduce:transition-none dark:border-slate-600 dark:text-white'

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

const TRIGGER =
  'inline-flex cursor-pointer items-center justify-center border-2 border-slate-950 bg-brand-blue font-display text-xs font-bold uppercase tracking-widest text-white shadow-[3px_3px_0px_#020617] transition-colors hover:bg-brand-sky active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0px_#008CD5]'

// Mobile: a round FAB pinned clear of the footer with its safe-area inset.
const FAB = 'fixed bottom-[calc(1.75rem+env(safe-area-inset-bottom))] right-7 z-40 h-14 w-14 rounded-full p-0'

// Desktop: the square tab stays attached to the frame edge, as before.
const EDGE_TRIGGER =
  'h-16 min-h-0 w-11 rounded-l-md rounded-r-none rounded-b-none border-y-2 border-l-2 border-r-0 px-0 shadow-[-3px_3px_0px_#020617]'

const PANEL =
  'overflow-hidden rounded-md border-2 border-slate-950 bg-white shadow-[4px_4px_0px_#020617] overscroll-contain transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none dark:border-brand-sky dark:bg-[#0B1B2B] dark:shadow-[4px_4px_0px_#008CD5]'

// The sheet sits a finger-width above the FAB, regardless of safe area.
const SHEET =
  'fixed bottom-[calc(6.25rem+env(safe-area-inset-bottom))] right-7 z-40 w-[min(20rem,calc(100vw-3.5rem))] origin-bottom-right'

const POPOVER =
  'relative mr-2 w-64 origin-right shadow-rigid-blue dark:shadow-rigid-amber'

export function MoreMenu({ isDark, onToggleTheme, showToast }: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareLabel, setShareLabel] = useTemporaryState('SALIN LINK')
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(max-width: 639px)').matches,
  )
  const wrapperRef = useRef<HTMLElement>(null)
  const mobileRootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // The modal treatment only applies where the menu is a floating sheet.
  // Keep aria-modal, the backdrop and the focus trap in step with it.
  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)')
    const sync = () => setIsMobile(query.matches)
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    requestAnimationFrame(() => toggleRef.current?.focus({ preventScroll: true }))
  }, [])

  useEffect(() => {
    if (!isOpen) return

    // Hand focus to the close control as the menu opens so keyboard and screen
    // reader users land inside it rather than at the top of the page.
    panelRef.current
      ?.querySelector<HTMLElement>('[data-menu-initial-focus]')
      ?.focus({ preventScroll: true })

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      const inside =
        wrapperRef.current?.contains(target) ||
        mobileRootRef.current?.contains(target)
      if (!inside) closeMenu()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      // The desktop popover stays non-modal; only the mobile sheet traps Tab.
      if (event.key !== 'Tab' || !isMobile) return
      const panel = panelRef.current
      if (!panel) return

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }

    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isMobile, closeMenu])

  const handleShare = async () => {
    const copied = await copyText(window.location.href)
    if (!copied) {
      showToast('GAGAL MENYALIN URL')
      return
    }
    showToast('LINK LANDING PAGE BERHASIL DISALIN!')
    setShareLabel('TERSALIN!')
  }

  const renderToggle = () => (
    <button
      ref={toggleRef}
      id="more-toggle-btn"
      type="button"
      aria-expanded={isOpen}
      aria-controls="more-tooltip"
      aria-label={
        isOpen ? 'Tutup menu opsi tambahan' : 'Buka menu opsi tambahan'
      }
      onClick={() => (isOpen ? closeMenu() : setIsOpen(true))}
      className={`${TRIGGER} ${isMobile ? FAB : EDGE_TRIGGER} ${FOCUS} ${TOUCH}`}
    >
      <MoreIcon
        className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'} shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
          isOpen ? 'rotate-90' : 'rotate-0'
        }`}
      />
    </button>
  )

  const renderPanel = () => (
    <div
      ref={panelRef}
      id="more-tooltip"
      role="dialog"
      aria-modal={isMobile ? true : undefined}
      aria-labelledby="more-menu-title"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={`${PANEL} ${isMobile ? SHEET : POPOVER} ${
        isMobile
          ? isOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
          : isOpen
            ? 'translate-x-0 scale-100 opacity-100'
            : 'pointer-events-none translate-x-3 scale-95 opacity-0'
      }`}
    >
      <div
        id="more-menu-header"
        className="flex items-center justify-between gap-3 border-b-2 border-slate-950 bg-brand-blue px-4 py-3 text-white dark:border-brand-sky"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <MoreIcon className="h-4 w-4 shrink-0" />
          <h2
            id="more-menu-title"
            className="truncate font-display text-xs font-bold uppercase tracking-widest"
          >
            MENU OPSI
          </h2>
        </div>
        <button
          id="more-menu-close-btn"
          type="button"
          data-menu-initial-focus
          aria-label="Tutup menu opsi tambahan"
          onClick={closeMenu}
          className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border-2 border-white/40 bg-slate-950/30 transition-colors hover:bg-slate-950 motion-reduce:transition-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${TOUCH}`}
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <button
          id="share-link-btn"
          type="button"
          onClick={handleShare}
          className={`group ${ACTION} gap-3 bg-slate-100 hover:border-brand-blue hover:bg-brand-blue hover:text-white active:bg-brand-sky dark:bg-slate-900 dark:hover:bg-brand-sky ${FOCUS} ${TOUCH}`}
        >
          <ShareIcon className="h-4 w-4 shrink-0 text-brand-blue group-hover:text-white dark:text-brand-sky" />
          <span className="min-w-0 flex-1 truncate text-left">{shareLabel}</span>
        </button>

        <button
          id="theme-toggle-btn"
          type="button"
          role="switch"
          aria-checked={isDark}
          onClick={onToggleTheme}
          className={`${ACTION} justify-between bg-slate-100 hover:border-brand-blue hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 ${FOCUS} ${TOUCH}`}
        >
          <span className="flex min-w-0 items-center gap-3">
            {isDark ? (
              <MoonIcon className="h-4 w-4 shrink-0 text-brand-sky" />
            ) : (
              <SunIcon className="h-4 w-4 shrink-0 text-brand-amber" />
            )}
            <span className="truncate">MODE GELAP</span>
          </span>
          <span
            aria-hidden="true"
            className="flex h-6 w-12 shrink-0 items-center rounded-sm border-2 border-slate-950 bg-slate-300 p-0.5 transition-colors dark:border-brand-sky dark:bg-brand-blue"
          >
            <span
              className={`h-4 w-4 rounded-sm bg-slate-950 transition-transform duration-200 motion-reduce:transition-none dark:bg-white ${
                isDark ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  )

  // The FAB, sheet and backdrop are portaled to the body: the reveal transform
  // on the desktop wrapper would otherwise turn `fixed` into a relative anchor.
  if (isMobile) {
    return createPortal(
      <>
        <div
          id="more-menu-backdrop"
          aria-hidden="true"
          onClick={closeMenu}
          className={`fixed inset-0 z-[35] bg-slate-950/65 backdrop-blur-[2px] transition-opacity duration-200 motion-reduce:transition-none ${
            isOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
        />
        <div ref={mobileRootRef} className="contents">
          {renderToggle()}
          {renderPanel()}
        </div>
      </>,
      document.body,
    )
  }

  return (
    <aside
      ref={wrapperRef}
      id="more-drawer-wrapper"
      data-reveal
      data-reveal-delay="680"
      className="absolute right-0 top-1/2 z-40 flex -translate-y-1/2 flex-row-reverse items-center"
    >
      {renderToggle()}
      {renderPanel()}
    </aside>
  )
}
