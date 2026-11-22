import { useEffect, useRef, useState } from 'react'
import { useTemporaryState } from '../hooks/useTemporaryState'
import { copyText } from '../utils/copyText'
import {
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
const ACTION =
  'flex min-h-12 w-full cursor-pointer items-center rounded-md border-2 border-slate-950 px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors motion-reduce:transition-none dark:border-slate-600 dark:text-white'

export function MoreMenu({ isDark, onToggleTheme, showToast }: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareLabel, setShareLabel] = useTemporaryState('SALIN LINK')
  const wrapperRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleShare = async () => {
    const copied = await copyText(window.location.href)
    if (!copied) {
      showToast('GAGAL MENYALIN URL')
      return
    }
    showToast('LINK LANDING PAGE BERHASIL DISALIN!')
    setShareLabel('TERSALIN!')
  }

  return (
    <aside
      ref={wrapperRef}
      id="more-drawer-wrapper"
      data-reveal
      data-reveal-delay="680"
      className="relative z-40 flex w-full items-center justify-center pb-[env(safe-area-inset-bottom)] sm:absolute sm:right-0 sm:top-1/2 sm:w-auto sm:-translate-y-1/2 sm:flex-row-reverse sm:items-center sm:pb-0"
    >
      <button
        ref={toggleRef}
        id="more-toggle-btn"
        type="button"
        aria-expanded={isOpen}
        aria-controls="more-tooltip"
        aria-label={
          isOpen ? 'Tutup menu opsi tambahan' : 'Buka menu opsi tambahan'
        }
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 border-slate-950 bg-brand-blue px-5 font-display text-xs font-bold uppercase tracking-widest text-white shadow-[3px_3px_0px_#020617] transition-colors hover:bg-brand-sky active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0px_#008CD5] sm:h-16 sm:min-h-0 sm:w-11 sm:rounded-l-md sm:rounded-r-none sm:rounded-b-none sm:border-y-2 sm:border-l-2 sm:border-r-0 sm:px-0 sm:shadow-[-3px_3px_0px_#020617] ${FOCUS} ${TOUCH}`}
      >
        <MoreIcon
          className={`h-5 w-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none sm:h-6 sm:w-6 ${
            isOpen ? 'rotate-90' : 'rotate-0'
          }`}
        />
        <span className="sm:hidden">MENU OPSI</span>
      </button>

      <div
        id="more-tooltip"
        role="group"
        aria-label="Menu Tambahan"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute bottom-full left-1/2 z-10 mb-3.5 w-[min(19rem,calc(100vw-2.5rem))] -translate-x-1/2 origin-bottom rounded-md border-2 border-slate-950 bg-white p-2.5 shadow-[4px_4px_0px_#020617] overscroll-contain transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none dark:border-brand-sky dark:bg-[#0B1B2B] dark:shadow-[4px_4px_0px_#008CD5] sm:relative sm:bottom-auto sm:left-auto sm:mr-2 sm:mb-0 sm:w-64 sm:translate-x-0 sm:translate-y-0 sm:origin-right sm:border-b-2 sm:shadow-rigid-blue sm:dark:shadow-rigid-amber ${
          isOpen
            ? 'translate-y-0 opacity-100 sm:scale-100'
            : 'pointer-events-none translate-y-3 opacity-0 sm:translate-x-3 sm:scale-95'
        }`}
      >
        <div className="flex flex-col gap-2.5">
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
              className="flex h-6 w-11 shrink-0 items-center rounded-sm border-2 border-slate-950 bg-slate-300 p-0.5 transition-colors dark:border-brand-sky dark:bg-brand-blue"
            >
              <span
                className={`h-4 w-4 rounded-sm bg-slate-950 transition-transform duration-200 motion-reduce:transition-none dark:bg-white ${
                  isDark ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
