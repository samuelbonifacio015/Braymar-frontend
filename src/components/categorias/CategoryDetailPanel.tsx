"use client"

import { X, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getColorClasses, getCategoryIcon } from "@/lib/categories"
import { StockBadge } from "@/components/inventario/StockBadge"
import type { Category } from "@/types/inventory"
import type { Product } from "@/types/inventory"

interface CategoryDetailPanelProps {
  category: Category
  products: Product[]
  onClose: () => void
}

export function CategoryDetailPanel({ category, products, onClose }: CategoryDetailPanelProps) {
  const colors = getColorClasses(category.color)
  const Icon = getCategoryIcon(category.icon)
  const catProducts = products.filter((p) => p.category === category.name)

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in" />
      <div
        className="relative w-full max-w-md bg-white shadow-xl animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn("px-6 py-5 border-b", colors.bg)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.light)}>
                {Icon && <Icon size={20} className={colors.icon} />}
              </div>
              <div>
                <h2 className="font-semibold">{category.name}</h2>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="px-6 py-3 border-b flex gap-4">
          <div>
            <span className="text-xs text-muted-foreground">Productos</span>
            <p className="font-semibold tabular-nums">{catProducts.length}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Stock Total</span>
            <p className="font-semibold tabular-nums">{catProducts.reduce((s, p) => s + p.stock, 0)}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Valor</span>
            <p className="font-semibold tabular-nums">
              S/ {catProducts.reduce((s, p) => s + p.stock * p.unitPrice, 0).toLocaleString("es-PE", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Product list */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-220px)]">
          {catProducts.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
              <Package size={20} className="mr-2" />
              No hay productos en esta categoria
            </div>
          ) : (
            catProducts.map((product) => (
              <Link
                key={product.id}
                href="/inventario"
                className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/50 hover:bg-brand-50/50 hover:border-brand-200 hover:shadow-sm transition-all duration-150 group cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate group-hover:text-brand-700 transition-colors">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.location}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StockBadge status={product.stockStatus} stock={product.stock} />
                  <span className="text-sm font-medium tabular-nums whitespace-nowrap">
                    S/ {product.unitPrice.toFixed(2)}
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
