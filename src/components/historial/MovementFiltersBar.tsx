import { RotateCcw, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MovementType } from "@/types/movements"
import type { Location } from "@/types/inventory"

const MOVEMENT_TYPES: { value: MovementType; label: string }[] = [
  { value: "entrada", label: "Entradas" },
  { value: "salida", label: "Salidas" },
  { value: "transferencia", label: "Transferencias" },
  { value: "ajuste", label: "Ajustes" },
]

const LOCATIONS: Location[] = ["Almacén Tienda", "Cochera", "Cangallo", "Santa Anita"]

interface MovementFiltersBarProps {
  filters: { type: MovementType | null; location: Location | ""; search: string }
  onChange: (filters: { type: MovementType | null; location: Location | ""; search: string }) => void
  onReset: () => void
  resultCount: number
}

export function MovementFiltersBar({
  filters,
  onChange,
  onReset,
  resultCount,
}: MovementFiltersBarProps) {
  return (
    <div className="space-y-2">
      {/* Type tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() =>
              onChange({ ...filters, type: filters.type === null ? null : null })
            }
            className={cn(
              "px-3.5 h-9 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
              filters.type === null
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            Todos
          </button>
          {MOVEMENT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() =>
                onChange({ ...filters, type: filters.type === t.value ? null : t.value })
              }
              className={cn(
                "px-3.5 h-9 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap",
                filters.type === t.value
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Location + count + reset row */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <MapPin size={14} className="text-gray-400 shrink-0" />
          <select
            value={filters.location}
            onChange={(e) =>
              onChange({ ...filters, location: e.target.value as Location | "" })
            }
            className="h-9 rounded-lg border border-gray-200 bg-white pl-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="">Todas</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <span className="text-xs text-gray-400 min-w-[48px]">
            {resultCount} {resultCount === 1 ? "registro" : "registros"}
          </span>

          {(filters.type || filters.location) && (
            <button
              onClick={onReset}
              className="min-h-[32px] h-8 px-2.5 text-xs text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label="Limpiar filtros"
            >
              <RotateCcw size={12} />
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
