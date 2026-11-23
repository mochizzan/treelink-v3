// In-app browsers (TikTok, Instagram, Facebook, etc.) embed a WebView that can
// silently ignore `target="_blank"` — most notably on Android — making a tap
// look broken. Navigating in place keeps the destination reachable inside the
// app, where the user can still hand off to their browser if needed.
const IN_APP_BROWSER =
  /TikTok|BytedanceWebview|musical_ly|Instagram|FBAN|FBAV|FB_IAB|Line\/|Snapchat|LinkedInApp|Pinterest|; wv/i

/**
 * Returns the anchor target that reliably opens external destinations in the
 * current browsing context: in place inside in-app browsers, in a new tab in
 * regular browsers.
 */
export function getExternalLinkTarget(): '_blank' | '_self' {
  const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent
  return IN_APP_BROWSER.test(userAgent) ? '_self' : '_blank'
}
