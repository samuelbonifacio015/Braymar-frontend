"use client"

import { useState } from "react"
import { getProducts } from "@/data/mock"
import type { ReportPeriod, ReportType } from "@/types/reports"
import { ReportFilters } from "@/components/reportes/ReportFilters"
import { StockGeneralReport } from "@/components/reportes/StockGeneralReport"
import { ValorAlmacenChart } from "@/components/reportes/ValorAlmacenChart"
import { MasVendidosChart } from "@/components/reportes/MasVendidosChart"
import { MargenesTable } from "@/components/reportes/MargenesTable"
import { MovimientosTable } from "@/components/reportes/MovimientosTable"

const REPORT_TABS: { key: ReportType; label: string }[] = [
  { key: "stock_general", label: "Stock General" },
  { key: "valor_almacen", label: "Valor por Almacen" },
  { key: "mas_vendidos", label: "Mas Vendidos" },
  { key: "margenes", label: "Margenes" },
  { key: "movimientos", label: "Movimientos" },
]

export default function ReportesPage() {
  const products = getProducts()
  const [period, setPeriod] = useState<ReportPeriod>("month")
  const [category, setCategory] = useState<string>("")
  const [activeTab, setActiveTab] = useState<ReportType>("stock_general")

  // Unique categories from products
  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).sort()

  // Filter products by selected category
  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products

  const renderReport = () => {
    switch (activeTab) {
      case "stock_general":
        return <StockGeneralReport products={filteredProducts} />
      case "valor_almacen":
        return <ValorAlmacenChart products={filteredProducts} />
      case "mas_vendidos":
        return <MasVendidosChart products={filteredProducts} />
      case "margenes":
        return <MargenesTable products={filteredProducts} />
      case "movimientos":
        return <MovimientosTable />
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Reportes</h1>
        <p className="text-muted-foreground">Analisis de inventario y ventas</p>
      </div>

      {/* Filters */}
      <ReportFilters
        period={period}
        onPeriodChange={setPeriod}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      {/* Report type tabs */}
      <div className="flex gap-1 border-b">
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active report */}
      {renderReport()}
    </div>
  )
}
