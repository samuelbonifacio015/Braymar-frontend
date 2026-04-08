"use client"

import { useState, useMemo } from "react"
import { useProducts } from "@/hooks/use-products"
import { useProviders } from "@/hooks/use-providers"
import { generateAlerts } from "@/lib/alerts"
import type { AlertSeverity } from "@/types/alerts"
import { Topbar } from "@/components/layout/Topbar"
import { AlertMetricCards } from "@/components/alertas/AlertMetricCards"
import { AlertToolbar } from "@/components/alertas/AlertToolbar"
import { AlertCard } from "@/components/alertas/AlertCard"
import { AlertEmptyState } from "@/components/alertas/AlertEmptyState"

export default function AlertasPage() {
  const { products, loading: productsLoading } = useProducts()
  const { providers, loading: providersLoading } = useProviders()
  const loading = productsLoading || providersLoading
  const [activeTab, setActiveTab] = useState<AlertSeverity | "todas">("todas")

  // Generar alertas basadas en el estado actual de productos y proveedores
  const allAlerts = useMemo(() => {
    if (loading || products.length === 0) return []
    return generateAlerts(products, providers)
  }, [products, providers, loading])

  // Filtrar por tab activo
  const filteredAlerts = useMemo(() => {
    if (activeTab === "todas") return allAlerts
    return allAlerts.filter((a) => a.severity === activeTab)
  }, [allAlerts, activeTab])

  // Contadores por severidad
  const urgentCount = allAlerts.filter((a) => a.severity === "urgente").length
  const warningCount = allAlerts.filter((a) => a.severity === "advertencia").length
  const infoCount = allAlerts.filter((a) => a.severity === "informativo").length

  const counts: Record<AlertSeverity | "todas", number> = {
    todas: allAlerts.length,
    urgente: urgentCount,
    advertencia: warningCount,
    informativo: infoCount,
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background">
      <Topbar title="Gestión de Alertas" searchQuery="" onSearchChange={() => {}} />

      <main className="flex-1 p-6 space-y-6">
        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">
            Alertas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTab === "todas"
              ? `${allAlerts.length} alerta${allAlerts.length !== 1 ? "s" : ""} activa${allAlerts.length !== 1 ? "s" : ""} en el sistema`
              : `${filteredAlerts.length} alerta${filteredAlerts.length !== 1 ? "s" : ""} de tipo ${activeTab}`}
          </p>
        </div>

        {/* Metric cards de resumen */}
        {!loading && (
          <AlertMetricCards
            totalCount={allAlerts.length}
            urgentCount={urgentCount}
            warningCount={warningCount}
            infoCount={infoCount}
          />
        )}

        {/* Toolbar con filtros + acciones */}
        <AlertToolbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
          filteredCount={filteredAlerts.length}
        />

        {/* Lista de alertas */}
        {loading ? (
          <div className="bg-card rounded-xl border border-border/40 shadow-sm">
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                Cargando alertas...
              </div>
            </div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <AlertEmptyState activeTab={activeTab} />
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert, idx) => (
              <AlertCard key={alert.id} alert={alert} index={idx} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
