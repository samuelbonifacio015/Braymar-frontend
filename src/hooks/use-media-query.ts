import { useState, useEffect } from "react"

/**
 * Hook to detect if the current viewport matches a media query
 * Uses window.matchMedia for efficient responsive detection
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

/**
 * Hook to detect if viewport is mobile (< 1024px, Tailwind lg: breakpoint)
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 1023px)")
}

/**
 * Hook to detect if viewport is desktop (>= 1024px, Tailwind lg: breakpoint)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)")
}
