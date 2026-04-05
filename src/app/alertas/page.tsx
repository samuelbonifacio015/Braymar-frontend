"use client"

import { useState, useMemo } from "react"
import { useProducts } from "@/hooks/use-products"
import { getProviders } from "@/data/mock-providers"
import { generateAlerts } from "@/lib/alerts"
import type { Alert, AlertSeverity } from "@/types/alerts"
import { Topbar } from "@/components/layout/Topbar"
import { AlertSummary } from "@/components/alertas/AlertSummary"
import { AlertCard } from "@/components/alertas/AlertCard"
import { cn } from "@/lib/utils"

const TABS: { value: AlertSeverity | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "urgente", label: "Urgentes" },
  { value: "advertencia", label: "Advertencias" },
  { value: "informativo", label: "Informativas" },
]

export default function AlertasPage() {
  const { products, loading } = useProducts()
  const providers = useMemo(() => getProviders(), [])
  const [activeTab, setActiveTab] = useState<AlertSeverity | "todas">("todas")

  const allAlerts = useMemo(() => {
    if (loading || products.length === 0) return []
    // Generar alertas basadas en el estado actual de productos y proveedores
    return generateAlerts(products, providers)
  }, [products, providers, loading])

  const filteredAlerts = useMemo(() => {
    if (activeTab === "todas") return allAlerts
    return allAlerts.filter((a) => a.severity === activeTab)
  }, [allAlerts, activeTab])

  const urgentCount = allAlerts.filter((a) => a.severity === "urgente").length
  const warningCount = allAlerts.filter((a) => a.severity === "advertencia").length
  const infoCount = allAlerts.filter((a) => a.severity === "informativo").length

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background">
      <Topbar title="Gestión de Alertas" searchQuery="" onSearchChange={() => {}} />

      <main className="flex-1 p-6 space-y-6">
        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">Alertas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTab === "todas"
              ? `${allAlerts.length} alertas activas en el sistema`
              : `${filteredAlerts.length} alertas ${activeTab}s`}
          </p>
        </div>

        {/* Resumen de severidad */}
        {!loading && (
          <AlertSummary
            urgentCount={urgentCount}
            warningCount={warningCount}
            infoCount={infoCount}
          />
        )}

        {/* Tabs de filtro */}
        <div className="flex items-center gap-1 bg-card rounded-lg border border-border/40 p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.value
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista de alertas */}
        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm bg-card rounded-lg border">
            Cargando alertas...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border text-muted-foreground">
            <p className="text-sm">No hay alertas que mostrar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
