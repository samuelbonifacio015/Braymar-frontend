"use client"

import { useState } from "react"
import { Settings, ChevronRight } from "lucide-react"

import { Topbar } from "@/components/layout/Topbar"
import { SettingsNav } from "@/components/configuracion/SettingsNav"
import { StoreSettingsCard } from "@/components/configuracion/StoreSettingsCard"
import { ThresholdSettings } from "@/components/configuracion/ThresholdSettings"
import { LocationsOverview } from "@/components/configuracion/LocationsOverview"
import { ProfileCard } from "@/components/configuracion/ProfileCard"
import { AppearanceSettings } from "@/components/configuracion/AppearanceSettings"
import { NotificationSettings } from "@/components/configuracion/NotificationSettings"
import { SecuritySettings } from "@/components/configuracion/SecuritySettings"
import { ToastProvider } from "@/components/ui/toast"
import { useGlobalPreferences } from "@/context/PreferencesContext"
import type { SettingsSection } from "@/types/settings"

export default function ConfiguracionPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general")
  const { preferences, isLoaded, updateSection, updateField, resetPreferences } = useGlobalPreferences()

  // Render del panel activo
  const renderPanel = () => {
    switch (activeSection) {
      case "general":
        return (
          <StoreSettingsCard
            store={preferences.store}
            onUpdate={(store) => updateSection("store", store)}
          />
        )
      case "inventario":
        return (
          <div className="space-y-4">
            <ThresholdSettings
              threshold={preferences.threshold}
              onUpdate={(threshold) => updateSection("threshold", threshold)}
            />
            <LocationsOverview />
          </div>
        )
      case "apariencia":
        return (
          <AppearanceSettings
            appearance={preferences.appearance}
            onUpdate={(appearance) => updateSection("appearance", appearance)}
          />
        )
      case "notificaciones":
        return (
          <NotificationSettings
            notifications={preferences.notifications}
            onUpdate={(notifications) => updateSection("notifications", notifications)}
          />
        )
      case "perfil":
        return (
          <ProfileCard
            profile={preferences.profile}
            onUpdate={(profile) => updateSection("profile", profile)}
          />
        )
      case "seguridad":
        return <SecuritySettings onResetConfig={resetPreferences} />
      default:
        return null
    }
  }

  const sectionTitles: Record<SettingsSection, string> = {
    general: "General",
    inventario: "Inventario",
    apariencia: "Apariencia",
    notificaciones: "Notificaciones",
    perfil: "Perfil",
    seguridad: "Seguridad",
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/80">
      <Topbar title="Configuración" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Settings size={13} />
          <span>Sistema</span>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">Configuración</span>
          <ChevronRight size={12} />
          <span className="text-brand-600 font-semibold">{sectionTitles[activeSection]}</span>
        </div>

        {/* Layout principal: nav lateral + contenido */}
        <div className="flex flex-col lg:flex-row gap-6">
          <SettingsNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Panel de contenido */}
          <div className="flex-1 min-w-0">
            {isLoaded ? (
              <div className="animate-in fade-in-0 duration-200">
                {renderPanel()}
              </div>
            ) : (
              // Skeleton mientras carga
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 h-48 animate-pulse" />
                <div className="bg-white rounded-2xl border border-gray-100 h-32 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </main>

      <ToastProvider />
    </div>
  )
}
