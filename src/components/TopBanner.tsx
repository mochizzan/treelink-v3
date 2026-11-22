import { useEffect, useRef, useState } from 'react'
import { TIP_URL } from '../data/socialLinks'
import { useTemporaryState } from '../hooks/useTemporaryState'
import { copyText } from '../utils/copyText'
import { CoffeeIcon, CopyIcon, ExternalLinkIcon } from './ui/icons'

type TopBannerProps = {
  showToast: (message: string) => void
}

// One timing function for every changing property, so the banner shrinks as
// one piece instead of exposing a half-changed intermediate state.
const EASE = 'duration-300 ease-out motion-reduce:transition-none'

export function TopBanner({ showToast }: TopBannerProps) {
  const [label, setLabel] = useTemporaryState('BAGIKAN')
  const [pinned, setPinned] = useState(false)
  const bannerRef = useRef<HTMLElement>(null)

  // Follow the computed sticky offset so the threshold tracks the safe-area
  // inset and the sm breakpoint instead of a hard-coded scroll distance.
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
    setLabel('TERSALIN!')
  }

  return (
    <header
      ref={bannerRef}
      id="top-banner"
      data-reveal
      data-reveal-delay="60"
      className={`sticky top-[calc(0.75rem+env(safe-area-inset-top))] z-30 mx-3 mt-3 rounded-md border-2 border-slate-950 bg-[#986900] text-white transition-shadow ${EASE} sm:top-4 sm:mx-5 sm:mt-4 dark:border-brand-sky ${
        pinned
          ? 'shadow-[3px_3px_0px_#020617]'
          : 'shadow-[4px_4px_0px_#020617]'
      }`}
    >
      <div
        className={`flex flex-col px-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 ${
          EASE
        } transition-[padding] ${pinned ? 'py-1.5 sm:py-2.5' : 'py-3 sm:py-2.5'}`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`inline-flex shrink-0 items-center justify-center rounded-md border-2 border-white/30 bg-slate-950/30 transition-all sm:border ${EASE} ${
              pinned ? 'h-8 w-8' : 'h-9 w-9 sm:h-8 sm:w-8'
            }`}
          >
            <CoffeeIcon
              className={`shrink-0 text-white transition-all ${EASE} ${
                pinned ? 'h-4 w-4' : 'h-5 w-5 sm:h-4 sm:w-4'
              }`}
            />
          </span>

          <div className="min-w-0">
            <span
              className={`block truncate font-display font-bold uppercase leading-tight tracking-wider transition-[font-size] ${EASE} ${
                pinned ? 'text-xs sm:text-base' : 'text-sm sm:text-base'
              }`}
            >
              COFFEE // SUPPORT CREATOR
            </span>

            <div
              className={`grid transition-[grid-template-rows,opacity] ${EASE} ${
                pinned
                  ? 'grid-rows-[0fr] opacity-0'
                  : 'grid-rows-[1fr] opacity-100'
              }`}
            >
              <span className="overflow-hidden">
                <span
                  className={`block text-[11px] leading-snug text-amber-100/90 transition-[padding] sm:truncate ${EASE} ${
                    pinned ? 'pt-0' : 'pt-1'
                  }`}
                >
                  Traktir kopi untuk dukung konten &amp; server komunitas
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          className={`flex gap-2 transition-[margin,padding,border-top-width] sm:mt-0 sm:border-t-0 sm:pt-0 ${EASE} ${
            pinned
              ? 'mt-1.5 border-t-0 pt-0'
              : 'mt-3 border-t-2 border-slate-950/25 pt-3 dark:border-brand-sky/25'
          }`}
        >
          <button
            id="copy-tip-btn"
            type="button"
            onClick={handleCopy}
            title="Salin URL halaman Tipmi"
            className={`inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md border-2 border-slate-950 bg-slate-950 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#008CD5] transition-[padding,gap,transform] sm:w-auto sm:flex-none sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm ${EASE} ${
              pinned ? 'scale-[0.97] gap-0 px-2 py-1.5' : 'gap-1.5 px-2 py-2'
            }`}
          >
            <CopyIcon className="h-3.5 w-3.5 shrink-0 text-brand-sky" />
            <span
              id="copy-tip-label"
              className={`block overflow-hidden whitespace-nowrap transition-[max-width,opacity] sm:max-w-[120px] sm:opacity-100 ${EASE} ${
                pinned ? 'max-w-0 opacity-0' : 'max-w-[120px] opacity-100'
              }`}
            >
              {label}
            </span>
          </button>

          <a
            href={TIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka halaman Tipmi / Donasi di tab baru"
            className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-md border-2 border-slate-950 bg-brand-blue font-display text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#020617] transition-[padding,gap,transform] sm:w-auto sm:flex-none sm:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-sm ${EASE} ${
              pinned ? 'scale-[0.97] gap-0 px-2 py-1.5' : 'gap-1.5 px-2 py-2'
            }`}
          >
            <span
              className={`block overflow-hidden whitespace-nowrap transition-[max-width,opacity] sm:max-w-[80px] sm:opacity-100 ${EASE} ${
                pinned ? 'max-w-0 opacity-0' : 'max-w-[80px] opacity-100'
              }`}
            >
              TRAKTIR
            </span>
            <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </header>
  )
}
