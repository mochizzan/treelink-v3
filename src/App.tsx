import { useCallback, useState } from 'react'
import { LinkActionModal } from './components/LinkActionModal'
import { MoreMenu } from './components/MoreMenu'
import { ProfileHeader } from './components/ProfileHeader'
import { SocialLinkCard } from './components/SocialLinkCard'
import { Toast } from './components/ui/Toast'
import { TopBanner } from './components/TopBanner'
import { socialLinks, type SocialLink } from './data/socialLinks'
import { useReveal } from './hooks/useReveal'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'

export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const { message, visible, showToast } = useToast()
  const [activeLink, setActiveLink] = useState<SocialLink | null>(null)

  useReveal()

  const closeModal = useCallback(() => setActiveLink(null), [])

  return (
    // `clip` keeps the frame from creating a scroll container, which would
    // break the donation banner's position: sticky.
    <div className="outer-accent-frame flex min-h-screen flex-col overflow-x-clip p-3 font-mono text-slate-900 transition-colors duration-200 selection:bg-brand-sky selection:text-white sm:p-5 md:p-7 dark:text-slate-100">
      <div className="bg-grid-light relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-between border-[3px] border-slate-950 shadow-[6px_6px_0px_#986900] sm:border-4 dark:border-brand-sky dark:shadow-[6px_6px_0px_#008CD5]">
        <TopBanner showToast={showToast} />

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 pb-12 pt-8 sm:px-6 sm:pt-12">
          <ProfileHeader />

          <nav
            aria-label="Tautan Sosial Media"
            className="flex w-full max-w-xs flex-col gap-4 sm:max-w-sm"
          >
            {socialLinks.map((link, index) => (
              <SocialLinkCard
                key={link.platform}
                link={link}
                index={index}
                onSelect={setActiveLink}
              />
            ))}
          </nav>
        </main>

        <MoreMenu
          isDark={isDark}
          onToggleTheme={toggleTheme}
          showToast={showToast}
        />

        <footer
          data-reveal
          data-reveal-delay="760"
          className="w-full border-t-2 border-brand-blue/25 bg-white/75 px-5 py-4 sm:px-8 dark:border-brand-sky/25 dark:bg-[#081726]/85"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 pr-20 text-center sm:flex-row sm:pr-0 sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                REDA // OFFICIAL CREATOR HUB
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              &copy; 2026 REDA. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>

      <LinkActionModal
        link={activeLink}
        onClose={closeModal}
        showToast={showToast}
      />
      <Toast message={message} visible={visible} />
    </div>
  )
}
