"use client"

import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useGlobalPreferences } from "@/context/PreferencesContext"

interface TopbarProps {
  title: string
  searchQuery?: string
  onSearchChange?: (value: string) => void
}

export function Topbar({ title, searchQuery, onSearchChange }: TopbarProps) {
  const { preferences } = useGlobalPreferences()
  const profile = preferences.profile

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
    : "AU"

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Buscar por SKU o nombre..." 
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-brand-600 rounded-full h-10 shadow-none hover:bg-gray-100 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-gray-500 hover:text-gray-900 transition-colors">
            <Bell size={20} />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600">
              <span className="text-[10px] text-white">3</span>
            </Badge>
          </button>
          
          <Avatar className="h-9 w-9 ring-2 ring-brand-100">
            {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
            <AvatarFallback className="bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 font-bold text-xs">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
