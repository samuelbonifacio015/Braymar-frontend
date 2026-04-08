"use client"

import { useMemo, useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { useProducts } from "@/hooks/use-products"
import { ReportFilters } from "@/components/reportes/ReportFilters"
import type { ReportPeriod } from "@/types/reports"
import type { Product } from "@/types/inventory"

// High-end Charts
import { ValorAlmacenChart } from "@/components/reportes/ValorAlmacenChart"
import { MasVendidosChart } from "@/components/reportes/MasVendidosChart"
import { MargenesTable } from "@/components/reportes/MargenesTable"

import { DollarSign, Package, TrendingUp } from "lucide-react"

export default function ReportesPage() {
  const { products, loading } = useProducts()
  const [period, setPeriod] = useState<ReportPeriod>("month")
  const [category, setCategory] = useState<string>("")

  // Filtros aplicables
  const categories = useMemo(() => Array.from(new Set(products.map((p: Product) => p.category))).sort(), [products])
  const filteredProducts = useMemo(() => category ? products.filter((p: Product) => p.category === category) : products, [category, products])

  // Macro KPIs (Calculados al vuelo según los filtros)
  const totalInmovilizadoCost = filteredProducts.reduce((sum: number, p: Product) => sum + p.stock * (p.cost || p.wholesalePrice * 0.7), 0)
  const totalInmovilizadoRetail = filteredProducts.reduce((sum: number, p: Product) => sum + p.stock * p.unitPrice, 0)
  const rentabilidadOculta = totalInmovilizadoRetail - totalInmovilizadoCost
  const globalMarginPercent = totalInmovilizadoRetail > 0 ? (rentabilidadOculta / totalInmovilizadoRetail) * 100 : 0
  const totalStockItems = filteredProducts.reduce((sum: number, p: Product) => sum + p.stock, 0)

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Topbar title="Dashboard de Inteligencia" searchQuery="" onSearchChange={() => {}} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        
        {/* Controles de Vista */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Análisis Operativo</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Métricas de rentabilidad y capitalizaciones en tiempo real.</p>
          </div>
          <ReportFilters
            period={period}
            onPeriodChange={setPeriod}
            category={category}
            onCategoryChange={setCategory}
            categories={categories as string[]}
          />
        </div>

        {/* --- FILA 1: TARJETAS MACRO (KPIs) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta 1 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Package size={80} strokeWidth={1} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Artículos Almacenados</p>
            <p className="text-4xl font-black text-gray-900 tabular-nums">
              {totalStockItems.toLocaleString("es-PE")}
            </p>
            <p className="text-sm font-medium text-gray-500 mt-2">
              <span className="text-brand-600 font-bold">{filteredProducts.length}</span> SKUs registrados
            </p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <DollarSign size={80} strokeWidth={1} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Capital Inmovilizado (Costo)</p>
            <p className="text-4xl font-black text-gray-900 tabular-nums">
              S/ {(totalInmovilizadoCost / 1000).toFixed(1)}k
            </p>
            <div className="mt-2 text-sm flex items-center gap-2">
              <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Valor Venta: S/ {(totalInmovilizadoRetail/1000).toFixed(1)}k</span>
            </div>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <TrendingUp size={80} strokeWidth={1} className="text-white" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Margen Promedio Global</p>
            <p className="text-4xl font-black text-white tabular-nums">
              {globalMarginPercent.toFixed(1)}%
            </p>
            <p className="text-sm font-medium text-gray-300 mt-2">
              Rentabilidad Bruta Potencial: S/ {(rentabilidadOculta/1000).toFixed(1)}k
            </p>
          </div>
        </div>

        {/* --- FILA 2: GRID DE DASHBOARD MAIN --- */}
        {/* La fila tendra 2 columnas principales. Izquierda: Tendencias Ventas, Derecha: Donut Inventario */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 flex flex-col min-h-0">
             <MasVendidosChart products={filteredProducts} />
          </div>
          <div className="xl:col-span-1 flex flex-col min-h-[400px]">
             <ValorAlmacenChart products={filteredProducts} />
          </div>
        </div>

        {/* --- FILA 3: COMPARATIVAS DE MARGEN (Abajo, ocupando todo el ancho) --- */}
        <div className="w-full">
           <MargenesTable products={filteredProducts} />
        </div>

      </main>
    </div>
  )
}
