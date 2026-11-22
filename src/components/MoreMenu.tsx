import { useEffect, useRef, useState } from 'react'
import { useTemporaryState } from '../hooks/useTemporaryState'
import { copyText } from '../utils/copyText'
import {
  ChevronLeftIcon,
  MoonIcon,
  ShareIcon,
  SunIcon,
} from './ui/icons'

type MoreMenuProps = {
  isDark: boolean
  onToggleTheme: () => void
  showToast: (message: string) => void
}

export function MoreMenu({ isDark, onToggleTheme, showToast }: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareLabel, setShareLabel] = useTemporaryState('SHARE LINK')
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
    setShareLabel('COPIED!')
  }

  return (
    <aside
      ref={wrapperRef}
      id="more-drawer-wrapper"
      className="relative z-40 flex w-full flex-col-reverse shadow-[-4px_-4px_0px_#020617] max-sm:pb-[env(safe-area-inset-bottom)] sm:absolute sm:right-0 sm:top-1/2 sm:w-auto sm:-translate-y-1/2 sm:flex-row-reverse sm:items-center sm:shadow-none"
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
        className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-b-md border-2 border-slate-950 bg-brand-blue px-4 text-white transition-colors hover:bg-brand-sky motion-reduce:transition-none sm:h-16 sm:min-h-0 sm:w-11 sm:justify-center sm:rounded-l-md sm:rounded-b-none sm:border-y-2 sm:border-l-2 sm:border-r-0 sm:px-0 sm:shadow-[-3px_3px_0px_#020617] dark:border-white"
      >
        <span className="font-display text-xs font-bold uppercase tracking-widest sm:hidden">
          MENU OPSI
        </span>
        <ChevronLeftIcon
          className={`h-5 w-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none sm:h-6 sm:w-6 ${
            isOpen ? '-rotate-90 sm:rotate-180' : 'rotate-90 sm:rotate-0'
          }`}
        />
      </button>

      <div
        id="more-tooltip"
        role="group"
        aria-label="Menu Tambahan"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute bottom-full left-0 z-10 w-full origin-bottom overflow-hidden rounded-t-md border-2 border-b-0 border-slate-950 bg-white p-3.5 transition-all duration-200 motion-reduce:transition-none sm:relative sm:bottom-auto sm:left-auto sm:mr-2 sm:w-64 sm:origin-right sm:rounded-md sm:border-b-2 sm:overflow-visible sm:shadow-rigid-blue dark:border-brand-sky dark:bg-[#0B1B2B] sm:dark:shadow-rigid-amber ${
          isOpen
            ? 'max-h-96 opacity-100 sm:max-h-none sm:translate-x-0 sm:scale-100 sm:opacity-100'
            : 'pointer-events-none max-h-0 opacity-0 sm:max-h-none sm:translate-x-3 sm:scale-95 sm:opacity-0'
        }`}
      >
        <div className="mb-2.5 flex items-center justify-between border-b-2 border-brand-blue/30 pb-2">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-brand-blue dark:text-brand-sky">
            MORE OPTIONS
          </span>
          <span className="h-2 w-2 rounded-sm bg-brand-amber" />
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            id="share-link-btn"
            type="button"
            onClick={handleShare}
            className="group flex min-h-11 w-full cursor-pointer items-center justify-between rounded-md border border-slate-300 bg-slate-100 px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors hover:border-slate-950 hover:bg-brand-blue hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-brand-sky"
          >
            <span className="flex items-center gap-2">
              <ShareIcon className="h-4 w-4 text-brand-blue group-hover:text-white dark:text-brand-sky" />
              <span>{shareLabel}</span>
            </span>
            <span className="text-[10px] opacity-75">COPY</span>
          </button>

          <button
            id="theme-toggle-btn"
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={onToggleTheme}
            className="flex min-h-11 w-full cursor-pointer items-center justify-between rounded-md border border-slate-300 bg-slate-100 px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-2">
              {isDark ? (
                <MoonIcon className="h-4 w-4 text-brand-sky" />
              ) : (
                <SunIcon className="h-4 w-4 text-brand-amber" />
              )}
              <span>{isDark ? 'DARK MODE' : 'LIGHT MODE'}</span>
            </span>
            <span className="flex h-5 w-9 items-center rounded-sm border border-slate-950 bg-slate-300 p-0.5 transition-colors dark:bg-brand-blue">
              <span
                className={`h-3.5 w-3.5 rounded-sm bg-slate-950 transition-transform duration-200 dark:bg-white ${
                  isDark ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
