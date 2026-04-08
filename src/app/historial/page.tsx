"use client"

import { useMemo, useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { StatsCards } from "@/components/historial/StatsCards"
import { MovementFiltersBar } from "@/components/historial/MovementFiltersBar"
import { MovementTable } from "@/components/historial/MovementTable"
import { MovementDetailModal } from "@/components/historial/MovementDetailModal"
import { ProductTimelineModal } from "@/components/historial/ProductTimelineModal"
import { mockMovements } from "@/data/mock-movements"
import type { MovementType, StockMovement } from "@/types/movements"
import type { Location } from "@/types/inventory"

export default function HistorialPage() {
  const [filters, setFilters] = useState<{
    type: MovementType | null
    location: Location | ""
    search: string
  }>({ type: null, location: "", search: "" })

  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string
    name: string
    sku: string
  } | null>(null)

  // Filtrar movimientos segun los criterios actuales
  const filteredMovements = useMemo(() => {
    return mockMovements.filter((m) => {
      if (filters.type && m.type !== filters.type) return false
      if (filters.location && m.fromLocation !== filters.location && m.toLocation !== filters.location) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!m.productName.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [filters])

  const handleReset = () => setFilters({ type: null, location: "", search: "" })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar
        title="Historial de Movimientos"
        searchQuery={filters.search}
        onSearchChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
      />

      <main className="flex-1 p-3 sm:p-6 space-y-5">
        {/* Resumen estadistico del dia */}
        <StatsCards movements={mockMovements} />

        {/* Filtros compactos */}
        <MovementFiltersBar
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
          resultCount={filteredMovements.length}
        />

        {/* Tabla de movimientos */}
        <MovementTable 
          movements={filteredMovements} 
          onMovementClick={(mov) => setSelectedMovement(mov)}
          onProductClick={(id, name, sku) => setSelectedProduct({ id, name, sku })}
        />
      </main>

      {/* Modales */}
      <MovementDetailModal
        movement={selectedMovement}
        open={selectedMovement !== null}
        onOpenChange={(open) => !open && setSelectedMovement(null)}
      />

      <ProductTimelineModal
        productId={selectedProduct?.id || null}
        productName={selectedProduct?.name || null}
        productSku={selectedProduct?.sku || null}
        open={selectedProduct !== null}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </div>
  )
}

