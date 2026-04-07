"use client"

import { Topbar } from "@/components/layout/Topbar"
import { StoreSettingsCard } from "@/components/configuracion/StoreSettingsCard"
import { ThresholdSettings } from "@/components/configuracion/ThresholdSettings"
import { LocationsOverview } from "@/components/configuracion/LocationsOverview"
import { ProfileCard } from "@/components/configuracion/ProfileCard"

export default function ConfiguracionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar title="Configuracion" />

      <main className="flex-1 p-6 space-y-6">
        <StoreSettingsCard />
        <ThresholdSettings />
        <LocationsOverview />
        <ProfileCard />
      </main>
    </div>
  )
}
