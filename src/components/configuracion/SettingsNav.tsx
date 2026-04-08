"use client"

import {
  Building2,
  Package,
  Palette,
  Bell,
  User,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { SettingsSection } from "@/types/settings"

interface SettingsNavProps {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}

const navItems: { id: SettingsSection; label: string; icon: React.ComponentType<{ size?: number }> ; description: string }[] = [
  { id: "general", label: "General", icon: Building2, description: "Datos de la tienda" },
  { id: "inventario", label: "Inventario", icon: Package, description: "Umbrales y ubicaciones" },
  { id: "apariencia", label: "Apariencia", icon: Palette, description: "Diseño y densidad" },
  { id: "notificaciones", label: "Notificaciones", icon: Bell, description: "Alertas y avisos" },
  { id: "perfil", label: "Perfil", icon: User, description: "Tu cuenta" },
  { id: "seguridad", label: "Seguridad", icon: Shield, description: "Contraseña y sesiones" },
]

export function SettingsNav({ activeSection, onSectionChange }: SettingsNavProps) {
  return (
    <>
      {/* Desktop: vertical sidebar navigation */}
      <nav className="hidden lg:flex flex-col gap-1 min-w-[220px]" role="tablist" aria-label="Secciones de configuración">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex items-center gap-3 w-full rounded-xl px-3.5 py-3 text-left transition-all duration-150",
                isActive
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <div
                className={cn(
                  "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                  isActive ? "bg-white/20" : "bg-gray-100"
                )}
              >
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{item.label}</p>
                <p
                  className={cn(
                    "text-xs mt-0.5 truncate",
                    isActive ? "text-white/70" : "text-muted-foreground"
                  )}
                >
                  {item.description}
                </p>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Mobile / Tablet: horizontal scrollable tabs */}
      <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-1 px-1">
        <nav className="flex gap-1.5 min-w-max pb-1" role="tablist" aria-label="Secciones de configuración">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "flex items-center gap-2 shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 bg-white border border-gray-200"
                )}
              >
                <Icon size={16} />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
