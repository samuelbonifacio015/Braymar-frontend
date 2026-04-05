"use client"

import { Package, Layers, TrendingUp } from "lucide-react"

interface CategoryOverviewProps {
  totalCategories: number
  categorizedProducts: number
  totalValue: number
}

export function CategoryOverview({ totalCategories, categorizedProducts, totalValue }: CategoryOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
            <Layers size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categorias</p>
            <p className="text-2xl font-bold tabular-nums">{totalCategories}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Package size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Productos</p>
            <p className="text-2xl font-bold tabular-nums">{categorizedProducts}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor Total</p>
            <p className="text-2xl font-bold tabular-nums">S/ {totalValue.toLocaleString("es-PE")}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <TrendingUp size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor Promedio</p>
            <p className="text-2xl font-bold tabular-nums">S/ {totalCategories > 0 ? Math.round(totalValue / totalCategories).toLocaleString("es-PE") : 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
