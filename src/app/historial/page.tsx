"use client"

import { useMemo, useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { StatsCards } from "@/components/historial/StatsCards"
import { MovementFiltersBar } from "@/components/historial/MovementFiltersBar"
import { MovementTable } from "@/components/historial/MovementTable"
import { MovementDetailModal } from "@/components/historial/MovementDetailModal"
import { ProductTimelineModal } from "@/components/historial/ProductTimelineModal"
import { useEffect } from "react"
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

  const [movementsList, setMovementsList] = useState<StockMovement[]>([])

  useEffect(() => {
    import("@/lib/supabase/client").then(({ supabase }) => {
      supabase.from("movements").select("*").order("created_at", { ascending: false }).then(({ data }) => {
        if (data) {
          const formatted = data.map(m => ({
            ...m,
            productId: m.product_id,
            productName: m.product_name,
            fromLocation: m.from_location,
            toLocation: m.to_location,
            performedBy: m.performed_by,
            createdAt: m.created_at
          })) as StockMovement[]
          setMovementsList(formatted)
        }
      })
    })
  }, [])

  // Filtrar movimientos segun los criterios actuales
  const filteredMovements = useMemo(() => {
    return movementsList.filter((m) => {
      if (filters.type && m.type !== filters.type) return false
      if (filters.location && m.fromLocation !== filters.location && m.toLocation !== filters.location) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!m.productName.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [filters, movementsList])

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
        <StatsCards movements={movementsList} />

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

