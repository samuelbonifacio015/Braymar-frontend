"use client"

import { type ReactNode, useEffect } from "react"
import { PreferencesProvider, useGlobalPreferences } from "@/context/PreferencesContext"
import { Sidebar } from "@/components/layout/Sidebar"
import { cn } from "@/lib/utils"
import { useMobileDrawer } from "@/hooks/use-mobile-drawer"

function LayoutContent({ children }: { children: ReactNode }) {
  const { preferences, isLoaded } = useGlobalPreferences()
  const collapsed = preferences.appearance.sidebarCollapsed
  const { isMobile, mobileDrawerOpen, toggleDrawer } = useMobileDrawer()

  // Expose drawer toggle via custom event for Topbar
  useEffect(() => {
    const handler = () => toggleDrawer()
    window.addEventListener("braymar:toggle-drawer", handler)
    return () => window.removeEventListener("braymar:toggle-drawer", handler)
  }, [toggleDrawer])

  return (
    <>
      {/* Desktop Sidebar: only visible on desktop (>= 1024px) */}
      {!isMobile && (
        <Sidebar collapsed={collapsed} profile={preferences.profile} />
      )}

      {/* Mobile Drawer: only visible on mobile (< 1024px) */}
      {isMobile && (
        <>
          <Sidebar
            collapsed={false}
            profile={preferences.profile}
            isMobileDrawer
            open={mobileDrawerOpen}
            onClose={() => {}}
          />

          {/* Backdrop/Scrim for mobile drawer */}
          <div
            className={cn(
              "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]",
              "transition-opacity duration-200 ease-out",
              mobileDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            onClick={toggleDrawer}
            aria-hidden="true"
          />
        </>
      )}

      <div
        className={cn(
          "flex-1 flex flex-col min-w-0",
          "lg:transition-[margin] lg:duration-300 lg:ease-in-out",
          collapsed ? "lg:ml-[72px]" : "lg:ml-60"
        )}
      >
        {children}
      </div>
    </>
  )
}

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <LayoutContent>{children}</LayoutContent>
    </PreferencesProvider>
  )
}
