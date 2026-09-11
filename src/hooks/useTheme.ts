import { useCallback, useEffect, useState } from 'react'
import { loadJSON, saveJSON, removeJSON } from '../lib/storage'

type ThemeOverride = 'light' | 'dark' | null

const STORE_NAME = 'theme'

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(isDark: boolean): void {
  document.documentElement.classList.toggle('dark', isDark)
}

export function useTheme() {
  const [override, setOverride] = useState<ThemeOverride>(() => loadJSON<ThemeOverride>(STORE_NAME, null))
  const [systemDark, setSystemDark] = useState(systemPrefersDark)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])

  const isDark = override ?? (systemDark ? 'dark' : 'light')

  useEffect(() => {
    applyTheme(isDark === 'dark')
  }, [isDark])

  const toggle = useCallback(() => {
    setOverride((prev) => {
      const current = prev ?? (systemDark ? 'dark' : 'light')
      const next: ThemeOverride = current === 'dark' ? 'light' : 'dark'
      saveJSON(STORE_NAME, next)
      return next
    })
  }, [systemDark])

  const clearOverride = useCallback(() => {
    removeJSON(STORE_NAME)
    setOverride(null)
  }, [])

  return { isDark: isDark === 'dark', toggle, hasOverride: override !== null, clearOverride }
}
