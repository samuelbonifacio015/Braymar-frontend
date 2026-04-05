import { StoreSettingsCard } from "@/components/configuracion/StoreSettingsCard"
import { ThresholdSettings } from "@/components/configuracion/ThresholdSettings"
import { LocationsOverview } from "@/components/configuracion/LocationsOverview"
import { ProfileCard } from "@/components/configuracion/ProfileCard"

export default function ConfiguracionPage() {
  return (
    <div className="flex flex-col gap-5">
      <header className="mb-1">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Configuracion</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ajustes generales del sistema y de la tienda
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <StoreSettingsCard />
        <ThresholdSettings />
        <LocationsOverview />
        <ProfileCard />
      </div>
    </div>
  )
}
