"use client"

import { Search, Bell, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useGlobalPreferences } from "@/context/PreferencesContext"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TopbarProps {
  title: string
  searchQuery?: string
  onSearchChange?: (value: string) => void
}

export function Topbar({ title, searchQuery, onSearchChange }: TopbarProps) {
  const { preferences } = useGlobalPreferences()
  const profile = preferences.profile
  const [searchFocused, setSearchFocused] = useState(false)

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
    : "AU"

  const toggleMobileDrawer = () => {
    window.dispatchEvent(new CustomEvent("braymar:toggle-drawer"))
  }

  return (
    <header
      className={cn(
        "h-16 border-b border-gray-200 bg-white",
        "flex items-center justify-between",
        "px-4 sm:px-6 lg:px-6",
        "gap-3 sm:gap-4"
      )}
    >
      {/* Left section: Hamburger + Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-none">
        {/* Hamburger: visible only on <lg */}
        <button
          onClick={toggleMobileDrawer}
          className={cn(
            "lg:hidden p-2 rounded-md",
            "min-w-[44px] min-h-[44px] flex items-center justify-center",
            "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
            "active:scale-95 transition-transform",
            "touch-manipulation"
          )}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
          {title}
        </h2>
      </div>

      {/* Right section: Search + Actions */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 lg:flex-none lg:w-auto justify-end">
        {/* Search bar: full-width on mobile, fixed on desktop */}
        <div className={cn(
          "relative",
          "w-full sm:w-80 lg:w-96",
          "transition-all duration-200"
        )}>
          <Search
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
              searchFocused ? "text-brand-600" : "text-gray-400",
              "size-[18px]"
            )}
          />
          <Input
            placeholder="Buscar por SKU o nombre..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              "pl-10 bg-gray-50 border-gray-200 focus-visible:ring-brand-600",
              "rounded-full h-11 min-h-[44px] shadow-none",
              "text-sm",
              "hover:bg-gray-100 focus:bg-white",
              "transition-colors"
            )}
          />
        </div>

        {/* Action buttons: hidden on very small screens, shown on sm+ */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-4 shrink-0">
          {/* Notifications */}
          <button
            className={cn(
              "relative p-2 rounded-full",
              "min-w-[44px] min-h-[44px] flex items-center justify-center",
              "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
              "active:scale-95 transition-transform",
              "touch-manipulation"
            )}
            aria-label="Notifications, 3 unread"
          >
            <Bell size={20} />
            <Badge className="absolute top-1.5 right-1.5 h-4 w-4 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600">
              <span className="text-[10px] text-white">3</span>
            </Badge>
          </button>

          {/* User Avatar */}
          <Avatar className="h-9 w-9 ring-2 ring-brand-100 shrink-0">
            {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
            <AvatarFallback className="bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
