"use client"

import { type ReactNode } from "react"
import { PreferencesProvider, useGlobalPreferences } from "@/context/PreferencesContext"
import { Sidebar } from "@/components/layout/Sidebar"
import { cn } from "@/lib/utils"

function LayoutContent({ children }: { children: ReactNode }) {
  const { preferences, isLoaded } = useGlobalPreferences()
  const collapsed = preferences.appearance.sidebarCollapsed

  return (
    <>
      <Sidebar collapsed={collapsed} profile={preferences.profile} />
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-in-out",
          collapsed ? "ml-[72px]" : "ml-60"
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
