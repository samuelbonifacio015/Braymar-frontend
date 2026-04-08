import * as icons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Product } from "@/types/inventory"

const COLOR_MAP: Record<string, { bg: string; border: string; icon: string; text: string; ring: string; gradient: string; light: string }> = {
  blue:    { bg: "bg-blue-50",    border: "border-blue-200", icon: "text-blue-600",   text: "text-blue-700",   ring: "ring-blue-200",   gradient: "from-blue-500 to-blue-600", light: "bg-blue-100" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",icon: "text-amber-600",  text: "text-amber-700",  ring: "ring-amber-200",  gradient: "from-amber-500 to-amber-600", light: "bg-amber-100" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200",icon: "text-emerald-600",text: "text-emerald-700",ring: "ring-emerald-200",gradient: "from-emerald-500 to-emerald-600", light: "bg-emerald-100" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",icon: "text-violet-600", text: "text-violet-700", ring: "ring-violet-200", gradient: "from-violet-500 to-violet-600", light: "bg-violet-100" },
  pink:    { bg: "bg-pink-50",    border: "border-pink-200", icon: "text-pink-600",   text: "text-pink-700",   ring: "ring-pink-200",   gradient: "from-pink-500 to-pink-600", light: "bg-pink-100" },
  rose:    { bg: "bg-rose-50",    border: "border-rose-200", icon: "text-rose-600",   text: "text-rose-700",   ring: "ring-rose-200",   gradient: "from-rose-500 to-rose-600", light: "bg-rose-100" },
  slate:   { bg: "bg-slate-50",   border: "border-slate-200",icon: "text-slate-600",  text: "text-slate-700",  ring: "ring-slate-200",  gradient: "from-slate-500 to-slate-600", light: "bg-slate-100" },
}

export function getColorClasses(color: string) {
  return COLOR_MAP[color] ?? COLOR_MAP.slate
}

export function getCategoryIcon(name: string): LucideIcon | null {
  return (icons as any)[name] ?? null
}

export interface CategoryStats {
  productCount: number
  totalStock: number
  inventoryValue: number
  optimalCount: number
  lowStockCount: number
  agotadoCount: number
  stockSharePercent: number
}

export function computeCategoryStats(
  categoryName: string,
  products: Product[],
  totalStock: number
): CategoryStats {
  const catProducts = products.filter((p) => p.category === categoryName)
  const totalStockSum = catProducts.reduce((s, p) => s + p.stock, 0)
  const value = catProducts.reduce((s, p) => s + p.stock * p.unitPrice, 0)

  return {
    productCount: catProducts.length,
    totalStock: totalStockSum,
    inventoryValue: value,
    optimalCount: catProducts.filter((p) => p.stockStatus === "optimo").length,
    lowStockCount: catProducts.filter((p) => p.stockStatus === "bajo_stock").length,
    agotadoCount: catProducts.filter((p) => p.stockStatus === "agotado").length,
    stockSharePercent: totalStock > 0 ? (totalStockSum / totalStock) * 100 : 0,
  }
}

export function computeAllCategoryStats(
  categories: { name: string; color: string }[],
  products: Product[]
) {
  const totalStock = products.reduce((s, p) => s + p.stock, 0)
  return categories.map((cat) => ({
    ...cat,
    ...computeCategoryStats(cat.name, products, totalStock),
  }))
}

export function computeCategoryOverview(
  categoryCount: number,
  products: Product[]
) {
  return {
    totalCategories: categoryCount,
    categorizedProducts: products.filter((p) => p.category).length,
    totalValue: products.reduce((s, p) => s + p.stock * p.unitPrice, 0),
    avgValue: categoryCount > 0
      ? products.reduce((s, p) => s + p.stock * p.unitPrice, 0) / categoryCount
      : 0,
  }
}

export const COLOR_OPTIONS = Object.keys(COLOR_MAP)
