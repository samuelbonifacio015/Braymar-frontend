"use client"

import { type ReactNode, useState, useEffect } from "react"
import { PreferencesProvider, useGlobalPreferences } from "@/context/PreferencesContext"
import { Sidebar } from "@/components/layout/Sidebar"
import { cn } from "@/lib/utils"

function LayoutContent({ children }: { children: ReactNode }) {
  const { preferences, isLoaded } = useGlobalPreferences()
  const collapsed = preferences.appearance.sidebarCollapsed
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mobileDrawerOpen])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileDrawerOpen])

  return (
    <>
      {/* Desktop Sidebar: visible on lg+ */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} profile={preferences.profile} />
      </div>

      {/* Mobile Drawer: overlay sidebar on <lg */}
      <Sidebar
        collapsed={false}
        profile={preferences.profile}
        isMobileDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Backdrop/Scrim for mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden",
          "transition-opacity duration-200 ease-out",
          mobileDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileDrawerOpen(false)}
        aria-hidden="true"
      />

      <div
        className={cn(
          "flex-1 flex flex-col min-w-0",
          /* Desktop margin: only apply on lg+ */
          "lg:transition-[margin] lg:duration-300 lg:ease-in-out",
          "lg:" + (collapsed ? "ml-[72px]" : "ml-60")
        )}
      >
        {children}
      </div>

      {/* Expose drawer toggle via custom event for Topbar */}
      <DrawerToggleDispatcher onToggle={() => setMobileDrawerOpen(prev => !prev)} />
    </>
  )
}

/* Helper component to expose drawer state via DOM event */
function DrawerToggleDispatcher({ onToggle }: { onToggle: () => void }) {
  useEffect(() => {
    const handler = () => onToggle()
    window.addEventListener("braymar:toggle-drawer", handler)
    return () => window.removeEventListener("braymar:toggle-drawer", handler)
  }, [onToggle])

  return null
}

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <LayoutContent>{children}</LayoutContent>
    </PreferencesProvider>
  )
}
