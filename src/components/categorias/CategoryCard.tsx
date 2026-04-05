"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { getColorClasses, getCategoryIcon, computeCategoryStats } from "@/lib/categories"
import { Progress } from "@/components/ui/progress"
import type { Product } from "@/types/inventory"
import type { Category } from "@/types/inventory"

interface CategoryCardProps {
  category: Category
  products: Product[]
  onClick: () => void
}

export function CategoryCard({ category, products, onClick }: CategoryCardProps) {
  const colors = getColorClasses(category.color)
  const Icon = getCategoryIcon(category.icon)
  const stats = useMemo(
    () => computeCategoryStats(category.name, products, products.reduce((s, p) => s + p.stock, 0)),
    [category.name, products]
  )

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative bg-card rounded-xl border shadow-sm text-left transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5 hover:border-border text-left w-full overflow-hidden",
        colors.border
      )}
    >
      {/* Color accent bar at top */}
      <div className={cn("h-1.5 w-full bg-gradient-to-r", colors.gradient)} />

      <div className="p-5">
        {/* Header: Icon + Name */}
        <div className="flex items-start gap-3 mb-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colors.bg)}>
            {Icon && <Icon size={24} className={colors.icon} />}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm leading-tight truncate">{category.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{category.description}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Productos</p>
            <p className="text-lg font-semibold tabular-nums">{stats.productCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Stock</p>
            <p className="text-lg font-semibold tabular-nums">{stats.totalStock}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valor</p>
            <p className="text-lg font-semibold tabular-nums">S/ {stats.inventoryValue.toLocaleString("es-PE", { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        {/* Share bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Participación</span>
            <span className="text-xs font-medium tabular-nums">{stats.stockSharePercent.toFixed(1)}%</span>
          </div>
          <Progress value={stats.stockSharePercent} className={cn("h-1.5", colors.light)} />
        </div>

        {/* Health indicators */}
        <div className="flex items-center gap-2">
          {stats.optimalCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {stats.optimalCount} ópt.
            </span>
          )}
          {stats.lowStockCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {stats.lowStockCount} bajo
            </span>
          )}
          {stats.agotadoCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {stats.agotadoCount} agot.
            </span>
          )}
          {stats.productCount === 0 && (
            <span className="text-xs text-muted-foreground italic">Sin productos</span>
          )}
        </div>
      </div>
    </button>
  )
}
