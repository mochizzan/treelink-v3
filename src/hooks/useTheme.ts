import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'creator-ui-theme'

function getInitialTheme(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark'
  } catch {
    return false
  }
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
    } catch {
      // Storage may be unavailable in restricted contexts.
    }
  }, [isDark])

  const toggleTheme = useCallback(() => setIsDark((current) => !current), [])

  return { isDark, toggleTheme }
}
