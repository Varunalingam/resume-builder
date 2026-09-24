import { useEffect, useState } from 'react'

export function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('theme-mode')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme-mode', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme-mode', 'light')
    }
  }, [isDark])

  const toggleDarkMode = () => setIsDark((prev) => !prev)

  return [isDark, toggleDarkMode]
}
