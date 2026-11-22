import { useEffect } from 'react'

// A single observer drives both the page-load cascade and the on-scroll
// reveal. Markup only needs `data-reveal` plus an optional stagger value.
// Reveal state lives in data attributes, not classes: React rebuilds some
// components' `class` attributes on state changes (the banner pins on scroll)
// and would otherwise wipe an imperatively-added class mid-animation.
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    )

    for (const node of nodes) {
      const stagger = node.dataset.revealDelay
      if (stagger) node.style.setProperty('--reveal-delay', `${stagger}ms`)
    }

    // Reduced motion (and browsers without IO) skip straight to the final
    // state — no element is ever left waiting on an animation that won't run.
    const skipMotion =
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (skipMotion) {
      for (const node of nodes) node.dataset.visible = 'done'
      return
    }

    const reveal = (node: HTMLElement) => {
      if (node.dataset.visible) return

      // Anything that arrives after the first observer pass is a scroll
      // reveal: drop the load stagger so it answers the scroll immediately.
      if (node.dataset.revealPhase !== 'load') {
        node.style.setProperty('--reveal-delay', '0ms')
      }

      const finish = (event: AnimationEvent) => {
        if (event.target !== node) return
        node.dataset.visible = 'done'
        node.removeEventListener('animationend', finish)
      }

      node.addEventListener('animationend', finish)
      node.dataset.visible = 'pending'
    }

    let firstPass = true
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const node = entry.target as HTMLElement
          if (firstPass) node.dataset.revealPhase = 'load'
          reveal(node)
          observer.unobserve(node)
        }
        firstPass = false
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    )

    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [])
}
