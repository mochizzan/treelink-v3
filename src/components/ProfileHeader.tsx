import { useState } from 'react'
import avatarUrl from '../assets/avatar.png'
import { AvatarFallbackIcon } from './ui/icons'

export function ProfileHeader() {
  const [avatarFailed, setAvatarFailed] = useState(false)

  return (
    <section
      aria-label="Profil Kreator"
      className="mb-8 flex w-full flex-col items-center text-center sm:mb-9"
    >
      <div className="relative mb-4">
        <div
          data-reveal="stamp"
          data-reveal-delay="160"
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-[3px] border-slate-950 bg-brand-blue shadow-[4px_4px_0px_#986900] sm:h-28 sm:w-28 dark:border-brand-sky dark:shadow-[4px_4px_0px_#008CD5]"
        >
          {avatarFailed ? (
            <AvatarFallbackIcon className="h-12 w-12 text-white" />
          ) : (
            <img
              src={avatarUrl}
              alt="Avatar REDA"
              className="h-full w-full object-cover object-center"
              onError={() => setAvatarFailed(true)}
            />
          )}
        </div>
        <span
          data-reveal
          data-reveal-delay="280"
          className="absolute -bottom-1 -right-1 rounded-sm border-2 border-slate-950 bg-brand-amber px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-white"
        >
          CREATOR
        </span>
      </div>

      <h1
        data-reveal
        data-reveal-delay="320"
        className="font-display text-2xl font-bold uppercase leading-none tracking-wider text-slate-950 sm:text-3xl dark:text-white"
      >
        REDA
      </h1>

      <p
        data-reveal
        data-reveal-delay="350"
        translate="no"
        className="mt-2 text-xs font-medium tracking-widest text-brand-blue dark:text-brand-sky"
      >
        @.onlyreda
      </p>

      <p
        data-reveal
        data-reveal-delay="380"
        className="mt-2.5 max-w-xs border-y border-brand-blue/30 px-3 py-2 text-xs font-medium leading-relaxed text-slate-600 sm:max-w-sm sm:text-sm dark:text-slate-300"
      >
        GAMING STREAMER • ROBLOX BUILDER • DIGITAL COMMUNITY HUB
      </p>
    </section>
  )
}
