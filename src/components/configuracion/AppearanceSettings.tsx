"use client"

import { Palette, LayoutGrid, Zap, PanelLeftClose, Check, Info } from "lucide-react"

import type { AppearancePreferences } from "@/types/settings"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface AppearanceSettingsProps {
  appearance: AppearancePreferences
  onUpdate: (appearance: AppearancePreferences) => void
}

export function AppearanceSettings({ appearance, onUpdate }: AppearanceSettingsProps) {
  const densityOptions: { value: AppearancePreferences["density"]; label: string; description: string }[] = [
    { value: "compact", label: "Compacta", description: "Menos espacio entre elementos" },
    { value: "default", label: "Normal", description: "Espaciado estándar" },
    { value: "comfortable", label: "Cómoda", description: "Más espacio y legibilidad" },
  ]

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
            <Palette size={18} className="text-pink-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Apariencia</h2>
            <p className="text-xs text-gray-500">Personaliza el diseño visual del sistema</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Densidad de la interfaz */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid size={14} className="text-gray-400" />
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Densidad de la interfaz
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {densityOptions.map((opt) => {
              const isSelected = appearance.density === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => onUpdate({ ...appearance, density: opt.value })}
                  className={cn(
                    "relative rounded-xl border-2 p-4 text-left transition-all duration-150",
                    isSelected
                      ? "border-brand-500 bg-brand-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  {/* Mini preview visual */}
                  <div className="flex flex-col gap-1 mb-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-sm bg-gray-200",
                          opt.value === "compact" && "h-1.5",
                          opt.value === "default" && "h-2",
                          opt.value === "comfortable" && "h-2.5"
                        )}
                        style={{ width: `${60 + i * 10}%` }}
                      />
                    ))}
                  </div>
                  <p className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-brand-700" : "text-gray-900"
                  )}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                </button>
              )
            })}
          </div>

          {/* Indicador de efecto activo */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <Info size={12} />
            <span>
              El cambio de densidad aplica al espaciado de tablas, listas y tarjetas en todo el sistema.
            </span>
          </div>
        </div>

        {/* Toggles */}
        <div className="border-t border-gray-100 pt-5 space-y-4">
          {/* Animaciones */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Zap size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Animaciones</p>
                <p className="text-xs text-gray-500">Transiciones suaves entre vistas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors",
                appearance.animationsEnabled
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              )}>
                {appearance.animationsEnabled ? "Activas" : "Desactivadas"}
              </span>
              <Switch
                checked={appearance.animationsEnabled}
                onCheckedChange={(checked: boolean) =>
                  onUpdate({ ...appearance, animationsEnabled: checked })
                }
              />
            </div>
          </div>

          {/* Sidebar colapsada */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <PanelLeftClose size={16} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Sidebar compacta</p>
                <p className="text-xs text-gray-500">Minimiza la barra lateral por defecto</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors",
                appearance.sidebarCollapsed
                  ? "bg-brand-50 text-brand-700"
                  : "bg-gray-100 text-gray-500"
              )}>
                {appearance.sidebarCollapsed ? "Compacta" : "Expandida"}
              </span>
              <Switch
                checked={appearance.sidebarCollapsed}
                onCheckedChange={(checked: boolean) =>
                  onUpdate({ ...appearance, sidebarCollapsed: checked })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
