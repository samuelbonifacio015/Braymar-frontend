"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useProducts } from "@/hooks/use-products"
import { useProviders } from "@/hooks/use-providers"
import { generateAlerts } from "@/lib/alerts"
import type { Alert, AlertSeverity } from "@/types/alerts"
import { Topbar } from "@/components/layout/Topbar"
import { AlertMetricCards } from "@/components/alertas/AlertMetricCards"
import { AlertToolbar } from "@/components/alertas/AlertToolbar"
import { AlertCard } from "@/components/alertas/AlertCard"
import { AlertEmptyState } from "@/components/alertas/AlertEmptyState"
import { getAlerts, syncAlerts, resolveAlert } from "@/actions/alerts"

export default function AlertasPage() {
  const { products, loading: productsLoading } = useProducts()
  const { providers, loading: providersLoading } = useProviders()
  const loading = productsLoading || providersLoading
  
  const [activeTab, setActiveTab] = useState<AlertSeverity | "todas">("todas")
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [syncing, setSyncing] = useState(false)

  // Fetch alerts from database on mount
  useEffect(() => {
    getAlerts(false).then(setAlerts)
  }, [])

  // Sync alerts when products or providers change
  useEffect(() => {
    if (!loading && products.length > 0) {
      setSyncing(true)
      syncAlerts().then(() => {
        getAlerts(false).then((dbAlerts) => {
          setAlerts(dbAlerts)
          setSyncing(false)
        })
      })
    }
  }, [products, providers, loading])

  // Filter by active tab
  const filteredAlerts = useMemo(() => {
    if (activeTab === "todas") return alerts
    return alerts.filter((a) => a.severity === activeTab)
  }, [alerts, activeTab])

  // Contadores por severidad
  const urgentCount = alerts.filter((a) => a.severity === "urgente").length
  const warningCount = alerts.filter((a) => a.severity === "advertencia").length
  const infoCount = alerts.filter((a) => a.severity === "informativo").length

  const counts: Record<AlertSeverity | "todas", number> = {
    todas: alerts.length,
    urgente: urgentCount,
    advertencia: warningCount,
    informativo: infoCount,
  }

  // Handle resolving an alert
  const handleResolveAlert = useCallback(async (alertId: string) => {
    const result = await resolveAlert(alertId)
    if (result.success) {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId))
    } else {
      console.error("Error resolving alert:", result.error)
      alert(`Error al resolver la alerta: ${result.error}`)
    }
  }, [])

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
            {syncing ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                Sincronizando alertas...
              </span>
            ) : activeTab === "todas" ? (
              `${alerts.length} alerta${alerts.length !== 1 ? "s" : ""} activa${alerts.length !== 1 ? "s" : ""} en el sistema`
            ) : (
              `${filteredAlerts.length} alerta${filteredAlerts.length !== 1 ? "s" : ""} de tipo ${activeTab}`
            )}
          </p>
        </div>

        {/* Metric cards de resumen */}
        {!loading && (
          <AlertMetricCards
            totalCount={alerts.length}
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
        {loading || syncing ? (
          <div className="bg-card rounded-xl border border-border/40 shadow-sm">
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                {loading ? "Cargando datos..." : "Sincronizando alertas..."}
              </div>
            </div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <AlertEmptyState activeTab={activeTab} />
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert, idx) => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                index={idx} 
                onResolve={handleResolveAlert}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
