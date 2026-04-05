"use client"

import { useMemo, useState } from "react"
import { Clock } from "lucide-react"
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
    <div className="max-w-7xl mx-auto space-y-6">
      { /* Encabezado de pagina */}
      <div className="flex items-center gap-3">
        <Clock className="text-brand-600" size={24} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Movimientos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registro de todas las operaciones de inventario</p>
        </div>
      </div>

      { /* Barra de filtros */}
      <MovementFilters filters={filters} onChange={setFilters} onReset={handleReset} />

      { /* Tabla de movimientos */}
      <MovementTable movements={filteredMovements} />
    </div>
  )
}
