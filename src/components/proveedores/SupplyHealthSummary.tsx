"use client"

import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import type { Product } from "@/types/inventory"

interface SupplyHealthSummaryProps {
  products: Product[]
}

export function SupplyHealthSummary({ products }: SupplyHealthSummaryProps) {
  const total = products.length
  const optimo = products.filter((p) => p.stockStatus === "optimo").length
  const bajoStock = products.filter((p) => p.stockStatus === "bajo_stock").length
  const agotado = products.filter((p) => p.stockStatus === "agotado").length

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50">
        <CheckCircle size={14} className="text-green-600 shrink-0" />
        <span className="text-xs font-medium text-green-700">{optimo} optimo</span>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50">
        <AlertTriangle size={14} className="text-amber-600 shrink-0" />
        <span className="text-xs font-medium text-amber-700">{bajoStock} bajo stock</span>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50">
        <AlertCircle size={14} className="text-red-600 shrink-0" />
        <span className="text-xs font-medium text-red-700">{agotado} agotado</span>
      </div>
    </div>
  )
}