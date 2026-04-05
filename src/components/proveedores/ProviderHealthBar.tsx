"use client"

import { AlertTriangle, TrendingDown, Truck, ShieldCheck } from "lucide-react"
import type { Provider } from "@/types/providers"

interface ProviderHealthBarProps {
  providers: Provider[]
}

const RELIABILITY_COLORS: Record<string, string> = {
  excelente: "text-green-600",
  muy_bueno: "text-emerald-600",
  bueno: "text-blue-600",
  regular: "text-amber-600",
  deficiente: "text-red-600",
}

const RELIABILITY_BG: Record<string, string> = {
  excelente: "bg-green-100",
  muy_bueno: "bg-emerald-100",
  bueno: "bg-blue-100",
  regular: "bg-amber-100",
  deficiente: "bg-red-100",
}

export function ProviderHealthBar({ providers }: ProviderHealthBarProps) {
  const total = providers.length
  const active = providers.filter((p) => p.status === "activo").length
  const avgOnTime = active > 0
    ? Math.round(
        providers.filter((p) => p.status === "activo").reduce((s, p) => s + p.onTimeRate, 0) /
          providers.filter((p) => p.status === "activo").length
      )
    : 0

  const alerts: { type: "warning" | "danger"; message: string }[] = []

  providers.forEach((p) => {
    if (p.status === "inactivo") {
      alerts.push({ type: "warning", message: `${p.name} esta inactivo` })
    }
    if (p.status === "en_revision") {
      alerts.push({ type: "warning", message: `${p.name} esta en revision` })
    }
    if (p.status === "activo" && p.onTimeRate < 70) {
      alerts.push({ type: "danger", message: `${p.name} tiene solo ${p.onTimeRate}% puntualidad` })
    }
    if (p.status === "activo" && p.productIds.length === 0) {
      alerts.push({ type: "warning", message: `${p.name} no tiene productos asignados` })
    }
  })

  return (
    <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
            <ShieldCheck size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
            <p className="text-xl font-bold tabular-nums">{total}</p>
            <p className="text-xs text-muted-foreground">{active} activos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <TrendingDown size={20} className="text-green-600 rotate-180" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Puntualidad</p>
            <p className="text-xl font-bold tabular-nums">{avgOnTime}%</p>
            <p className="text-xs text-muted-foreground">promedio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Truck size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Entrega</p>
            <p className="text-xl font-bold tabular-nums">
              {active > 0
                ? Math.round(
                    providers
                      .filter((p) => p.status === "activo")
                      .reduce((s, p) => s + p.deliveryDays, 0) /
                      providers.filter((p) => p.status === "activo").length
                  )
                : 0} dias
            </p>
            <p className="text-xs text-muted-foreground">promedio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Alertas</p>
            <p className="text-xl font-bold tabular-nums">{alerts.length}</p>
            <p className="text-xs text-muted-foreground">requieren atencion</p>
          </div>
        </div>
      </div>

      {/* Alerts strip */}
      {alerts.length > 0 && (
        <div className="border-t bg-muted/20 px-6 py-3">
          <div className="flex flex-wrap gap-2">
            {alerts.map((alert, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                  alert.type === "danger"
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <AlertTriangle size={12} />
                {alert.message}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
