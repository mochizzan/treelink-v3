import type { MouseEvent } from 'react'

const TIKTOK = /TikTok|BytedanceWebview|musical_ly|trill_|aweme|ultralite/i
const ANDROID = /Android/i

// In-app browsers (TikTok, Instagram, Facebook, etc.) embed a WebView that can
// silently ignore `target="_blank"` — most notably on Android — making a tap
// look broken. Navigating in place keeps the destination reachable inside the
// app, where the user can still hand off to their browser if needed.
const IN_APP_BROWSER =
  /TikTok|BytedanceWebview|musical_ly|trill_|aweme|ultralite|Instagram|FBAN|FBAV|FB_IAB|Line\/|Snapchat|LinkedInApp|Pinterest|; wv/i

type ExternalLinkProps = {
  href: string
  target: '_blank' | '_self'
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

function getUserAgent(): string {
  return typeof navigator === 'undefined' ? '' : navigator.userAgent
}

/**
 * TikTok's Android WebView blocks some external destinations with a "copy this
 * link into your browser" screen before the page ever loads. An Android intent
 * hands the URL to Chrome instead, turning that dead end into a normal handoff.
 */
function toAndroidBrowserIntent(url: string): string {
  try {
    const { host, pathname, search, protocol } = new URL(url)
    const scheme = protocol.replace(':', '')
    const fallback = encodeURIComponent(url)
    return `intent://${host}${pathname}${search}#Intent;scheme=${scheme};action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.android.chrome;S.browser_fallback_url=${fallback};end`
  } catch {
    return url
  }
}

export function getExternalLinkProps(url: string): ExternalLinkProps {
  const userAgent = getUserAgent()
  const isTikTok = TIKTOK.test(userAgent)

  // Match every Android WebView, not just TikTok's token, so a stripped UA
  // still gets the handoff instead of the copy-link dead end.
  if (ANDROID.test(userAgent) && IN_APP_BROWSER.test(userAgent)) {
    return {
      href: url,
      target: '_self',
      onClick: (event) => {
        event.preventDefault()
        try {
          window.location.assign(toAndroidBrowserIntent(url))
        } catch {
          window.location.assign(url)
        }
      },
    }
  }

  // On iOS there is no programmatic browser escape, and TikTok's WebView
  // handles `_blank` better than in-place navigation.
  if (isTikTok) return { href: url, target: '_blank' }

  return {
    href: url,
    target: IN_APP_BROWSER.test(userAgent) ? '_self' : '_blank',
  }
}
