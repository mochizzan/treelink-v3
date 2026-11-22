import { useTemporaryState } from '../hooks/useTemporaryState'
import { TIP_URL } from '../data/socialLinks'
import { copyText } from '../utils/copyText'
import { CoffeeIcon, CopyIcon, ExternalLinkIcon } from './ui/icons'

type TopBannerProps = {
  showToast: (message: string) => void
}

export function TopBanner({ showToast }: TopBannerProps) {
  const [label, setLabel] = useTemporaryState('SALIN URL')

  const handleCopy = async () => {
    const copied = await copyText(TIP_URL)
    if (!copied) {
      showToast('GAGAL MENYALIN URL')
      return
    }
    showToast('URL TIPME BERHASIL DISALIN!')
    setLabel('COPIED!')
  }

  return (
    <header
      id="top-banner"
      className="sticky top-3 z-40 mx-3 mt-3 rounded-md border-2 border-slate-950 bg-[#986900] text-white shadow-[4px_4px_0px_#020617] transition-all duration-200 sm:top-4 sm:mx-5 sm:mt-4 dark:border-brand-sky"
    >
      <div className="flex flex-col px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-white/30 bg-slate-950/30 sm:h-8 sm:w-8 sm:border">
            <CoffeeIcon className="h-5 w-5 text-white sm:h-4 sm:w-4" />
          </span>
          <div className="min-w-0">
            <span className="block font-display text-sm font-bold uppercase leading-tight tracking-wider sm:truncate sm:text-base">
              COFFEE // SUPPORT CREATOR
            </span>
            <span className="mt-1 block text-[11px] leading-snug text-amber-100/90 sm:truncate">
              Traktir kopi untuk dukung konten &amp; server komunitas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t-2 border-slate-950/25 pt-3 sm:flex sm:shrink-0 sm:items-center sm:gap-2 sm:border-t-0 sm:pt-0 dark:border-brand-sky/25">
          <button
            id="copy-tip-btn"
            type="button"
            onClick={handleCopy}
            title="Salin URL halaman TipMe"
            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border-2 border-slate-950 bg-slate-950 px-2 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#008CD5] transition-all hover:bg-slate-800 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none sm:min-h-0 sm:w-auto sm:px-3 sm:py-1.5 sm:text-sm"
          >
            <CopyIcon className="h-3.5 w-3.5 shrink-0 text-brand-sky" />
            <span id="copy-tip-label">{label}</span>
          </button>

          <a
            href={TIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka halaman TipMe / Donasi di tab baru"
            className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-md border-2 border-slate-950 bg-brand-blue px-2 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#020617] transition-all hover:bg-brand-sky active:translate-x-[1px] active:translate-y-[1px] active:shadow-none sm:min-h-0 sm:w-auto sm:px-3.5 sm:py-1.5 sm:text-sm"
          >
            <span>TIP ME</span>
            <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </header>
  )
}
