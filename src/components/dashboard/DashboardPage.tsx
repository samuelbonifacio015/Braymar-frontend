"use client"

import { useMemo } from "react"
import { useProducts } from "@/hooks/use-products"
import { MetricCards } from "@/components/inventario/MetricCards"
import { StockByWarehouseChart } from "./StockByWarehouseChart"
import { CategoryDistributionChart } from "./CategoryDistributionChart"
import { LowStockAlerts } from "./LowStockAlerts"
import { Loader2, TrendingUp, Activity } from "lucide-react"

/** Datos de actividad recientes (mock) */
interface ActivityEntry {
  id: number
  type: "sale" | "transfer" | "restock"
  product: string
  detail: string
  date: string
}

const recentActivities: ActivityEntry[] = [
  {
    id: 1,
    type: "sale",
    product: "Caja de galletas x24",
    detail: "Venta 48 unidades",
    date: "2026-04-05 10:30",
  },
  {
    id: 2,
    type: "transfer",
    product: "Aceite vegetal 1L",
    detail: "Traslado Almacén Tienda → Cangallo",
    date: "2026-04-05 09:15",
  },
  {
    id: 3,
    type: "restock",
    product: "Fideos Don Vicente 500g",
    detail: "Reabastecimiento 120 unidades",
    date: "2026-04-04 17:45",
  },
  {
    id: 4,
    type: "sale",
    product: "Arroz Costeño 5kg",
    detail: "Venta 30 unidades",
    date: "2026-04-04 14:20",
  },
  {
    id: 5,
    type: "transfer",
    product: "Leche Gloria 400ml",
    detail: "Traslado Cochera → Santa Anita",
    date: "2026-04-04 11:00",
  },
]

/** Mapeo visual de tipos de actividad */
const activityConfig: Record<
  ActivityEntry["type"],
  { label: string; icon: typeof TrendingUp; color: string; bg: string }
> = {
  sale: {
    label: "Venta",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  transfer: {
    label: "Transferencia",
    icon: Activity,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  restock: {
    label: "Reabastecimiento",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
}

export function DashboardPage() {
  const { products, loading } = useProducts()

  // Calcular métricas
  const metrics = useMemo(() => {
    if (products.length === 0)
      return { total: 0, lowStock: 0, agotados: 0, totalValue: 0 }

    const total = products.length
    const lowStock = products.filter(
      (p) => p.stockStatus === "bajo_stock"
    ).length
    const agotados = products.filter(
      (p) => p.stockStatus === "agotado"
    ).length
    const totalValue = products.reduce(
      (acc, p) => acc + p.unitPrice * p.stock,
      0
    )

    return { total, lowStock, agotados, totalValue }
  }, [products])

  // Fecha actual formateada
  const today = new Date()
  const dateStr = today.toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
        <p className="ml-3 text-sm text-muted-foreground">
          Cargando dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Encabezado de página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground capitalize mt-0.5">
            {dateStr}
          </p>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <MetricCards
        total={metrics.total}
        lowStock={metrics.lowStock}
        agotados={metrics.agotados}
        totalValue={metrics.totalValue}
      />

      {/* Gráficos lado a lado */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
        <StockByWarehouseChart products={products} />
        <CategoryDistributionChart products={products} />
      </div>

      {/* Alertas de stock bajo + Actividad reciente */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
        <LowStockAlerts products={products} />

        {/* Actividad reciente */}
        <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const config = activityConfig[activity.type]
              const Icon = config.icon

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 py-2"
                >
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full ${config.bg} flex items-center justify-center`}
                  >
                    <Icon size={14} className={config.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.product}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {config.label} - {activity.detail}
                    </p>
                  </div>
                  <time className="shrink-0 text-[11px] text-muted-foreground tabular-nums mt-0.5">
                    {activity.date.split(" ")[0]}
                  </time>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
