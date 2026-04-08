"use client"

import { useState, useEffect } from "react"
import { MapPin, PackageSearch, Pencil, X, Save, Warehouse } from "lucide-react"


import { type Location, type Product } from "@/types/inventory"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface LocationStat {
  name: Location
  productCount: number
  totalStock: number
  lowStockCount: number
}

function computeLocationStats(products: Product[]): LocationStat[] {
  const locations: Location[] = ["Almacén Tienda", "Cochera", "Cangallo", "Santa Anita"]

  return locations.map((loc) => {
    const locProducts = products.filter((p: Product) => p.location === loc)
    return {
      name: loc,
      productCount: locProducts.length,
      totalStock: locProducts.reduce((sum: number, p: Product) => sum + p.stock, 0),
      lowStockCount: locProducts.filter((p: Product) => p.stockStatus !== "optimo").length,
    }
  })
}

const ALIASES_KEY = "braymar-location-aliases"

function loadAliases(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const stored = localStorage.getItem(ALIASES_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveAliases(aliases: Record<string, string>) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(ALIASES_KEY, JSON.stringify(aliases))
  } catch {
    // localStorage lleno
  }
}

const locationColors: Record<Location, { bg: string; icon: string; border: string }> = {
  "Almacén Tienda": { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
  "Cochera": { bg: "bg-violet-50", icon: "text-violet-600", border: "border-violet-100" },
  "Cangallo": { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
  "Santa Anita": { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100" },
}

import { useProducts } from "@/hooks/use-products"

export function LocationsOverview() {
  const { products, loading } = useProducts()
  const stats = computeLocationStats(products)
  const [selectedLocation, setSelectedLocation] = useState<LocationStat | null>(null)
  const [editingAlias, setEditingAlias] = useState(false)
  const [aliasValue, setAliasValue] = useState("")
  const [aliases, setAliases] = useState<Record<string, string>>({})

  // Load aliases from localStorage on mount
  useEffect(() => {
    setAliases(loadAliases())
  }, [])

  const openDetail = (stat: LocationStat) => {
    setSelectedLocation(stat)
    setAliasValue(aliases[stat.name] || "")
    setEditingAlias(false)
  }

  const saveAlias = () => {
    if (selectedLocation) {
      const updated = { ...aliases, [selectedLocation.name]: aliasValue }
      // Remove empty aliases
      if (!aliasValue.trim()) {
        delete updated[selectedLocation.name]
      }
      setAliases(updated)
      saveAliases(updated)
      setEditingAlias(false)
      showToast(aliasValue.trim() ? "Alias guardado" : "Alias eliminado", "success")
    }
  }

  return (
    <>
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <MapPin size={18} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Ubicaciones</h2>
              <p className="text-xs text-gray-500">Resumen de stock por almacén — click para ver detalles</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {stats.map((s) => {
            const color = locationColors[s.name]
            return (
              <button
                key={s.name}
                onClick={() => openDetail(s)}
                className={cn(
                  "group rounded-xl border p-4 flex items-center gap-3 text-left transition-all duration-150",
                  "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
                  color.bg, color.border
                )}
              >
                <div className={cn("shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-white/80")}>
                  <Warehouse size={18} className={color.icon} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {aliases[s.name] || s.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.productCount} producto{s.productCount !== 1 && "s"} · {s.totalStock.toLocaleString("es-PE")} uds
                  </p>
                  {s.lowStockCount > 0 && (
                    <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                      {s.lowStockCount} con alerta
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Modal de detalle de ubicación */}
      <Dialog open={!!selectedLocation} onOpenChange={(open) => !open && setSelectedLocation(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warehouse size={18} className="text-brand-600" />
              {selectedLocation?.name}
            </DialogTitle>
            <DialogDescription>
              Detalles y configuración del almacén
            </DialogDescription>
          </DialogHeader>

          {selectedLocation && (
            <div className="space-y-4">
              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{selectedLocation.productCount}</p>
                  <p className="text-[11px] text-gray-500">Productos</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{selectedLocation.totalStock.toLocaleString("es-PE")}</p>
                  <p className="text-[11px] text-gray-500">Unidades</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className={cn("text-lg font-bold", selectedLocation.lowStockCount > 0 ? "text-amber-600" : "text-emerald-600")}>
                    {selectedLocation.lowStockCount}
                  </p>
                  <p className="text-[11px] text-gray-500">Con alerta</p>
                </div>
              </div>

              {/* Alias / Nombre personalizado */}
              <div className="border-t border-gray-100 pt-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Alias personalizado
                </label>
                {editingAlias ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={aliasValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAliasValue(e.target.value)}
                      placeholder={selectedLocation.name}
                      className="flex-1 rounded-lg"
                      autoFocus
                    />
                    <Button size="sm" onClick={saveAlias} className="bg-brand-600 hover:bg-brand-700 rounded-lg">
                      <Save size={14} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingAlias(false)}>
                      <X size={14} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-700">
                      {aliases[selectedLocation.name] || <span className="text-gray-400 italic">Sin alias</span>}
                    </p>
                    <Button size="sm" variant="ghost" onClick={() => setEditingAlias(true)}>
                      <Pencil size={14} className="mr-1" />
                      Editar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedLocation(null)}
              className="rounded-lg"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
