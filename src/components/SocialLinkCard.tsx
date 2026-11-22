import type { SocialLink } from '../data/socialLinks'
import { DiscordIcon, RobloxIcon, TiktokIcon } from './ui/icons'

type SocialLinkCardProps = {
  link: SocialLink
  index: number
  onSelect: (link: SocialLink) => void
}

const ICONS = {
  tiktok: TiktokIcon,
  discord: DiscordIcon,
  roblox: RobloxIcon,
} as const

export function SocialLinkCard({ link, index, onSelect }: SocialLinkCardProps) {
  const Icon = ICONS[link.icon]

  return (
    <a
      data-reveal
      data-reveal-delay={440 + index * 80}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        event.preventDefault()
        onSelect(link)
      }}
      className="social-link-trigger group flex w-full cursor-pointer items-center justify-between rounded-md border-2 border-brand-blue bg-white p-3.5 shadow-rigid-blue transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-slate-950 hover:bg-brand-blue sm:p-4 dark:border-brand-sky dark:bg-[#0B1B2B] dark:shadow-rigid-sky dark:hover:border-white dark:hover:bg-brand-sky"
    >
      <div className="flex items-center gap-3.5 sm:gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-2 border-slate-950 text-white transition-colors group-hover:bg-slate-950 sm:h-12 sm:w-12 ${link.iconBgClass}`}
        >
          <Icon className="h-6 w-6 fill-current" />
        </div>
        <div className="text-left">
          <span className="block font-display text-base font-bold uppercase leading-tight tracking-wider text-slate-950 group-hover:text-white sm:text-lg dark:text-white">
            {link.platform}
          </span>
          <span className="mt-0.5 block text-[11px] font-medium text-slate-500 group-hover:text-sky-100 dark:text-slate-400">
            {link.handle}
          </span>
          {link.subHandle && (
            <span className="mt-0.5 block text-[10px] font-medium text-slate-400 group-hover:text-sky-100/80 dark:text-slate-500">
              {link.subHandle}
            </span>
          )}
        </div>
      </div>
      <span className="pr-1 font-display text-lg font-bold text-brand-blue transition-transform group-hover:translate-x-1 group-hover:text-white dark:text-brand-sky">
        →
      </span>
    </a>
  )
}
