"use client"

import { useMemo } from "react"
import { AlertTriangle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { type Product } from "@/types/inventory"
import { cn } from "@/lib/utils"

interface LowStockAlertsProps {
  products: Product[]
  className?: string
}

export function LowStockAlerts({ products, className }: LowStockAlertsProps) {
  const flaggedProducts = useMemo(() => {
    return products
      .filter((p) => p.stockStatus === "bajo_stock" || p.stockStatus === "agotado")
      .sort((a, b) => {
        // Agotados primero, luego bajo stock
        if (a.stockStatus === "agotado" && b.stockStatus !== "agotado") return -1
        if (a.stockStatus !== "agotado" && b.stockStatus === "agotado") return 1
        return a.stock - b.stock
      })
  }, [products])

  if (flaggedProducts.length === 0) {
    return (
      <div className={cn("bg-card rounded-xl border border-border/40 shadow-sm p-5", className)}>
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Alertas de Stock Bajo
        </h3>
        <p className="text-sm text-muted-foreground">
          Todos los productos tienen niveles adecuados de stock.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("bg-card rounded-xl border border-border/40 shadow-sm p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-foreground">
            Alertas de Stock Bajo
          </h3>
          <span className="text-xs font-medium bg-red-100 text-red-700 rounded-full px-2 py-0.5">
            {flaggedProducts.length}
          </span>
        </div>
        <Link
          href="/inventario"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          Ver todo
          <ExternalLink size={12} />
        </Link>
      </div>

      <div className="space-y-2">
        {flaggedProducts.map((product) => (
          <div
            key={product.id}
            className={cn(
              "flex items-center justify-between py-2.5 px-3 rounded-lg border text-sm",
              product.stockStatus === "agotado"
                ? "border-red-200 bg-red-50/40"
                : "border-amber-200 bg-amber-50/40"
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground truncate">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.category} &middot; {product.location}
              </p>
            </div>
            <div className="text-right ml-3 shrink-0">
              <p
                className={cn(
                  "text-sm font-bold tabular-nums",
                  product.stockStatus === "agotado"
                    ? "text-red-600"
                    : "text-amber-600"
                )}
              >
                {product.stock}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {product.stockStatus === "agotado" ? "Agotado" : "Bajo"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
