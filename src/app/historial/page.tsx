"use client"

import { useMemo, useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { MovementFilters } from "@/components/historial/MovementFilters"
import { MovementTable } from "@/components/historial/MovementTable"
import { mockMovements } from "@/data/mock-movements"
import type { MovementType } from "@/types/movements"
import type { Location } from "@/types/inventory"

export default function HistorialPage() {
  const [filters, setFilters] = useState<{
    type: MovementType | null
    location: Location | ""
    search: string
  }>({ type: null, location: "", search: "" })

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

      <main className="flex-1 p-6 space-y-6">
        <MovementFilters filters={filters} onChange={setFilters} onReset={handleReset} />
        <MovementTable movements={filteredMovements} />
      </main>
    </div>
  )
}
