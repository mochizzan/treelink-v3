import { useEffect, useRef, useState } from 'react'
import { TIP_URL } from '../data/socialLinks'
import { useTemporaryState } from '../hooks/useTemporaryState'
import { copyText } from '../utils/copyText'
import { CoffeeIcon, CopyIcon, ExternalLinkIcon } from './ui/icons'

type TopBannerProps = {
  showToast: (message: string) => void
}

export function TopBanner({ showToast }: TopBannerProps) {
  const [label, setLabel] = useTemporaryState('SALIN URL')
  const [pinned, setPinned] = useState(false)
  const bannerRef = useRef<HTMLElement>(null)

  // The banner is sticky. Once it reaches its sticky offset, drop the helper
  // copy and compact the actions so it stops covering the link list on phones.
  useEffect(() => {
    const banner = bannerRef.current
    if (!banner) return

    let frame = 0
    const measure = () => {
      frame = 0
      const stickyTop = Number.parseFloat(getComputedStyle(banner).top) || 0
      setPinned(banner.getBoundingClientRect().top <= stickyTop + 2)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  const handleCopy = async () => {
    const copied = await copyText(TIP_URL)
    if (!copied) {
      showToast('GAGAL MENYALIN URL')
      return
    }
    showToast('URL TIPMI BERHASIL DISALIN!')
    setLabel('COPIED!')
  }

  return (
    <header
      ref={bannerRef}
      id="top-banner"
      className={`sticky top-[calc(0.75rem+env(safe-area-inset-top))] z-30 mx-3 mt-3 rounded-md border-2 border-slate-950 bg-[#986900] text-white transition-shadow duration-200 motion-reduce:transition-none sm:top-4 sm:mx-5 sm:mt-4 dark:border-brand-sky ${
        pinned
          ? 'shadow-[3px_3px_0px_#020617]'
          : 'shadow-[4px_4px_0px_#020617]'
      }`}
    >
      <div
        className={`px-3.5 sm:px-5 ${
          pinned
            ? 'flex items-center gap-2 py-1.5 sm:py-2.5'
            : 'flex flex-col py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-2.5'
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`inline-flex shrink-0 items-center justify-center rounded-md border-2 border-white/30 bg-slate-950/30 transition-all duration-200 motion-reduce:transition-none sm:border ${
              pinned ? 'h-8 w-8' : 'h-9 w-9 sm:h-8 sm:w-8'
            }`}
          >
            <CoffeeIcon
              className={`shrink-0 text-white transition-all duration-200 motion-reduce:transition-none ${
                pinned ? 'h-4 w-4' : 'h-5 w-5 sm:h-4 sm:w-4'
              }`}
            />
          </span>

          <div className="min-w-0">
            <span
              className={`block truncate font-display font-bold uppercase leading-tight tracking-wider ${
                pinned ? 'text-xs sm:text-base' : 'text-sm sm:text-base'
              }`}
            >
              {pinned ? 'SUPPORT REDA' : 'COFFEE // SUPPORT CREATOR'}
            </span>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none ${
                pinned
                  ? 'grid-rows-[0fr] opacity-0'
                  : 'grid-rows-[1fr] opacity-100'
              }`}
            >
              <span className="overflow-hidden">
                <span className="mt-1 block text-[11px] leading-snug text-amber-100/90 sm:truncate">
                  Traktir kopi untuk dukung konten &amp; server komunitas
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          className={`border-slate-950/25 dark:border-brand-sky/25 ${
            pinned
              ? 'ml-auto flex shrink-0 items-center gap-2'
              : 'grid w-full grid-cols-2 gap-2 border-t-2 pt-3 sm:flex sm:w-auto sm:shrink-0 sm:items-center sm:gap-2 sm:border-t-0 sm:pt-0'
          }`}
        >
          <button
            id="copy-tip-btn"
            type="button"
            onClick={handleCopy}
            title="Salin URL halaman Tipmi"
            className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-md border-2 border-slate-950 bg-slate-950 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#008CD5] transition-all hover:bg-slate-800 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none sm:min-h-0 sm:text-sm ${
              pinned
                ? 'min-w-11 px-2 py-1.5'
                : 'w-full px-2 py-2 sm:w-auto sm:px-3 sm:py-1.5'
            }`}
          >
            <CopyIcon className="h-3.5 w-3.5 shrink-0 text-brand-sky" />
            <span
              id="copy-tip-label"
              className={pinned ? 'sr-only sm:not-sr-only' : ''}
            >
              {label}
            </span>
          </button>

          <a
            href={TIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka halaman Tipmi / Donasi di tab baru"
            className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border-2 border-slate-950 bg-brand-blue font-display text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#020617] transition-all hover:bg-brand-sky active:translate-x-[1px] active:translate-y-[1px] active:shadow-none sm:min-h-0 sm:text-sm ${
              pinned
                ? 'min-w-11 px-2 py-1.5'
                : 'w-full px-2 py-2 sm:w-auto sm:px-3.5 sm:py-1.5'
            }`}
          >
            <span className={pinned ? 'sr-only sm:not-sr-only' : ''}>TIPMI</span>
            <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </header>
  )
}
