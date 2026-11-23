export type SocialLink = {
  platform: string
  handle: string
  url: string
  accent: string
  icon: 'tiktok' | 'discord' | 'roblox'
  iconBgClass: string
}

export const TIP_URL = 'https://sociabuzz.com/onlyreda/tribe'

export const socialLinks: SocialLink[] = [
  {
    platform: 'TIKTOK',
    handle: '@.onlyreda // Short Clips',
    url: 'https://www.tiktok.com/@.onlyreda?_r=1&_t=ZS-9BbaOft4dcq',
    accent: '#008CD5',
    icon: 'tiktok',
    iconBgClass: 'bg-brand-blue',
  },
  {
    platform: 'DISCORD',
    handle: 'REDA HQ // Community Server',
    url: 'https://discord.gg/2MrwTkZJZC',
    accent: '#0094DC',
    icon: 'discord',
    iconBgClass: 'bg-brand-sky',
  },
  {
    platform: 'ROBLOX',
    handle: '@redaliens04 // Games & UGC',
    url: 'https://www.roblox.com/users/7853072759/profile',
    accent: '#986900',
    icon: 'roblox',
    iconBgClass: 'bg-brand-amber',
  },
]
