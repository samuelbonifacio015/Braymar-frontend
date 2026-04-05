import { useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { MovementType } from "@/types/movements"
import type { Location } from "@/types/inventory"

const MOVEMENT_TYPES: MovementType[] = ["entrada", "salida", "transferencia", "ajuste"]
const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  entrada: "Entrada",
  salida: "Salida",
  transferencia: "Transferencia",
  ajuste: "Ajuste",
}
const LOCATIONS: Location[] = ["Almacén Tienda", "Cochera", "Cangallo", "Santa Anita"]

interface MovementFiltersProps {
  filters: { type: MovementType | null; location: Location | ""; search: string }
  onChange: (filters: { type: MovementType | null; location: Location | ""; search: string }) => void
  onReset: () => void
}

export function MovementFilters({ filters, onChange, onReset }: MovementFiltersProps) {
  const handleSearchChange = (value: string) => {
    onChange({ ...filters, search: value })
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
      { /* Barra de busqueda por nombre de producto */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Buscar por nombre de producto..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      { /* Filtros por tipo de movimiento (toggle buttons) */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tipo de movimiento</p>
        <div className="flex flex-wrap gap-2">
          {MOVEMENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onChange({ ...filters, type: filters.type === type ? null : type })}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors border",
                filters.type === type
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50",
              )}
            >
              {MOVEMENT_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      { /* Filtro por ubicacion */}
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ubicacion</p>
          <select
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value as Location | "" })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Todas las ubicaciones</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-1.5 shrink-0"
        >
          <RotateCcw size={14} />
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}
