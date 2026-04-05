"use client"

import { useState, useMemo } from "react"
import { Phone, Mail, MapPin, Building2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReliabilityBar } from "./ReliabilityBar"
import { SupplyHealthSummary } from "./SupplyHealthSummary"
import { StockBadge } from "@/components/inventario/StockBadge"
import type { Provider } from "@/types/providers"
import type { Product } from "@/types/inventory"

interface ProviderCardProps {
  provider: Provider
  products: Product[]
  onEdit: (provider: Provider) => void
}

const STATUS_COLORS: Record<string, string> = {
  activo: "bg-green-500",
  inactivo: "bg-gray-400",
  en_revision: "bg-amber-500",
}

const RELIABILITY_LABELS: Record<string, string> = {
  excelente: "Excelente",
  muy_bueno: "Muy Bueno",
  bueno: "Bueno",
  regular: "Regular",
  deficiente: "Deficiente",
}

export function ProviderCard({ provider, products, onEdit }: ProviderCardProps) {
  const [expanded, setExpanded] = useState(false)

  const linkedProducts = useMemo(
    () => products.filter((p) => provider.productIds.includes(p.id)),
    [products, provider.productIds]
  )

  const totalValue = linkedProducts.reduce((s, p) => s + p.stock * p.unitPrice, 0)
  const supplyGaps = linkedProducts.filter((p) => p.stockStatus === "agotado")
  const initials = provider.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className={cn(
      "bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden transition-all relative",
      expanded && "ring-2 ring-brand-200"
    )}>
      {/* Status dot */}
      <div className="absolute top-4 right-4 z-10">
        <span className={cn("relative flex w-3 h-3")}>
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", STATUS_COLORS[provider.status])} />
          <span className={cn("relative inline-flex rounded-full h-3 w-3", STATUS_COLORS[provider.status])} />
        </span>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3 pr-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: provider.avatarColor }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm leading-tight">{provider.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Building2 size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">RUC: {provider.ruc}</span>
            </div>
          </div>
        </div>

        {/* Contact strip */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Phone size={11} /> {provider.phone}
          </span>
          <span className="inline-flex items-center gap-1 truncate">
            <Mail size={11} /> {provider.email}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin size={11} />
          <span className="truncate">{provider.address}</span>
        </div>

        {/* Reliability */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Confiabilidad</span>
            <span className={cn("text-xs font-medium",
              provider.reliability === "excelente" ? "text-green-600" :
              provider.reliability === "muy_bueno" ? "text-emerald-600" :
              provider.reliability === "bueno" ? "text-blue-600" :
              provider.reliability === "regular" ? "text-amber-600" :
              "text-red-600"
            )}>
              {RELIABILITY_LABELS[provider.reliability]}
            </span>
          </div>
          <ReliabilityBar score={provider.reliabilityScore} />
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-3 mb-3 py-2 border-y">
          <div>
            <p className="text-xs text-muted-foreground">Productos</p>
            <p className="text-sm font-semibold tabular-nums">{linkedProducts.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valor</p>
            <p className="text-sm font-semibold tabular-nums">
              S/ {totalValue.toLocaleString("es-PE", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Entrega</p>
            <p className="text-sm font-semibold tabular-nums">{provider.deliveryDays} dias</p>
          </div>
        </div>

        {/* On-time rate */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">Entregas a tiempo</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  provider.onTimeRate >= 90 ? "bg-green-500" :
                  provider.onTimeRate >= 70 ? "bg-amber-500" :
                  "bg-red-500"
                )}
                style={{ width: `${provider.onTimeRate}%` }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums">{provider.onTimeRate}%</span>
          </div>
        </div>

        {/* Supply gaps warning */}
        {supplyGaps.length > 0 && expanded && (
          <div className="mb-3 p-2 rounded-lg bg-red-50 flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-600 shrink-0" />
            <span className="text-xs text-red-700 font-medium">
              {supplyGaps.length} producto{supplyGaps.length > 1 ? "s" : ""} agotado{supplyGaps.length > 1 ? "s" : ""} — necesita reabastecimiento
            </span>
          </div>
        )}

        {/* Supplies list */}
        <div className="text-xs text-muted-foreground mb-3">
          <span className="font-medium text-foreground">Suplencia: </span>
          {linkedProducts.length > 0
            ? linkedProducts.map((p) => p.category).filter((v, i, a) => a.indexOf(v) === i).join(", ")
            : "Sin productos asignados"}
        </div>

        {/* Expand / actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium"
          >
            {expanded ? (
              <>
                <ChevronUp size={14} /> Ver menos
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Ver detalles
              </>
            )}
          </button>
          <button
            onClick={() => onEdit(provider)}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
          >
            Editar
          </button>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 border-t pt-4 space-y-3">
            {/* Supply health */}
            {linkedProducts.length > 0 && (
              <>
                <SupplyHealthSummary products={linkedProducts} />

                <div className="space-y-1.5">
                  {linkedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sku} · {p.location}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StockBadge stock={p.stock} status={p.stockStatus} />
                        <span className="text-xs font-medium tabular-nums">
                          S/ {p.unitPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Notes */}
            {provider.notes && (
              <div className="p-2 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">{provider.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}