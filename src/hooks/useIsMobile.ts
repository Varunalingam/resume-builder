import { useEffect, useState } from 'react'

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
      : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [breakpoint])

  return isMobile
}
