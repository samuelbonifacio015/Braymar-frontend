import { useState, useEffect, useCallback } from "react"
import { useIsMobile } from "./use-media-query"

/**
 * Hook to manage mobile drawer state
 * Only activates drawer logic when viewport is mobile (< 1024px)
 * On desktop, returns inert state to prevent any mobile-specific behavior
 */
export function useMobileDrawer() {
  const isMobile = useIsMobile()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  // Close drawer on Escape key (only when mobile and drawer is open)
  useEffect(() => {
    if (!isMobile) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isMobile, mobileDrawerOpen])

  // Prevent body scroll when drawer is open (mobile only)
  useEffect(() => {
    if (!isMobile) return
    
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { 
      if (isMobile) {
        document.body.style.overflow = "" 
      }
    }
  }, [isMobile, mobileDrawerOpen])

  const toggleDrawer = useCallback(() => {
    if (isMobile) {
      setMobileDrawerOpen(prev => !prev)
    }
  }, [isMobile])

  const openDrawer = useCallback(() => {
    if (isMobile) {
      setMobileDrawerOpen(true)
    }
  }, [isMobile])

  const closeDrawer = useCallback(() => {
    if (isMobile) {
      setMobileDrawerOpen(false)
    }
  }, [isMobile])

  return {
    isMobile,
    mobileDrawerOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  }
}
