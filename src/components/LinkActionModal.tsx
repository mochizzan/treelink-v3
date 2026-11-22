import { useEffect, useState } from 'react'
import type { SocialLink } from '../data/socialLinks'
import { useTemporaryState } from '../hooks/useTemporaryState'
import { copyText } from '../utils/copyText'
import { CloseIcon, CopyIcon, ExternalLinkIcon } from './ui/icons'

type LinkActionModalProps = {
  link: SocialLink | null
  onClose: () => void
  showToast: (message: string) => void
}

type CopyActionButtonProps = {
  onCopy: () => Promise<boolean>
}

function CopyActionButton({ onCopy }: CopyActionButtonProps) {
  const [label, setLabel] = useTemporaryState('SALIN URL')

  const handleClick = async () => {
    if (await onCopy()) setLabel('TERSALIN!', 1800)
  }

  return (
    <button
      id="modal-copy-btn"
      type="button"
      onClick={handleClick}
      className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border-2 border-slate-950 bg-slate-100 px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[3px_3px_0px_#020617] transition-all hover:bg-brand-amber hover:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none sm:text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
    >
      <CopyIcon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  )
}

export function LinkActionModal({
  link,
  onClose,
  showToast,
}: LinkActionModalProps) {
  // Keep the last opened link rendered while the dialog fades out.
  const [renderedLink, setRenderedLink] = useState(link)
  const [displayLink, setDisplayLink] = useState(link)
  if (link !== renderedLink) {
    setRenderedLink(link)
    if (link) setDisplayLink(link)
  }

  const isOpen = link !== null

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleCopy = async (): Promise<boolean> => {
    if (!displayLink) return false
    const copied = await copyText(displayLink.url)
    if (!copied) {
      showToast('GAGAL MENYALIN URL')
      return false
    }
    showToast(`URL ${displayLink.platform} BERHASIL DISALIN!`)
    return true
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-platform-title"
      aria-hidden={!isOpen}
      inert={!isOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-[2px] transition-opacity duration-200 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        id="link-modal-card"
        className={`w-full max-w-sm overflow-hidden rounded-md border-[3px] border-slate-950 bg-white shadow-[6px_6px_0px_#986900] transition-transform duration-200 dark:border-brand-sky dark:bg-[#0B1B2B] dark:shadow-[6px_6px_0px_#008CD5] ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        <div
          id="modal-header-bar"
          className="flex items-center justify-between border-b-2 border-slate-950 bg-brand-blue px-4 py-3 text-white"
          style={{ backgroundColor: displayLink?.accent ?? '#008CD5' }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-950" />
            <h2
              id="modal-platform-title"
              className="font-display text-sm font-bold uppercase tracking-wider sm:text-base"
            >
              PILIH AKSI // {displayLink?.platform ?? ''}
            </h2>
          </div>
          <button
            id="modal-close-btn"
            type="button"
            aria-label="Tutup dialog"
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm bg-slate-950 text-white transition-colors hover:bg-slate-800"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <p className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {displayLink?.handle ?? ''}
          </p>

          <div className="mb-5 rounded-md border-2 border-slate-300 bg-slate-100 p-2.5 dark:border-slate-700 dark:bg-slate-900">
            <span className="mb-1 block font-display text-[10px] font-bold uppercase tracking-wider text-brand-amber dark:text-brand-sky">
              TARGET URL
            </span>
            <p className="break-all text-xs text-slate-900 select-all dark:text-slate-100">
              {displayLink?.url ?? ''}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CopyActionButton
              key={displayLink?.platform ?? 'empty'}
              onCopy={handleCopy}
            />

            <a
              id="modal-direct-link"
              href={displayLink?.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border-2 border-slate-950 bg-brand-blue px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[3px_3px_0px_#020617] transition-all hover:bg-brand-sky active:translate-x-[1px] active:translate-y-[1px] active:shadow-none sm:text-sm"
            >
              <span>DIRECT</span>
              <ExternalLinkIcon className="h-4 w-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
