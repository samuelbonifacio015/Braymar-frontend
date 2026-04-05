"use client"

import { MapPin, PackageSearch } from "lucide-react"

import { getProducts } from "@/data/mock"
import { type Location } from "@/types/inventory"
import { cn } from "@/lib/utils"

interface LocationStat {
  name: Location
  productCount: number
  totalStock: number
}

function computeLocationStats(): LocationStat[] {
  const products = getProducts()
  const locations: Location[] = ["Almacén Tienda", "Cochera", "Cangallo", "Santa Anita"]

  return locations.map((loc) => {
    const locProducts = products.filter((p) => p.location === loc)
    return {
      name: loc,
      productCount: locProducts.length,
      totalStock: locProducts.reduce((sum, p) => sum + p.stock, 0),
    }
  })
}

export function LocationsOverview() {
  const stats = computeLocationStats()

  return (
    <section className="bg-card rounded-xl border border-border/40 shadow-sm">
      <div className="px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <MapPin size={17} className="text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Ubicaciones</h2>
            <p className="text-xs text-muted-foreground">Resumen de stock por almacen</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.name}
            className="bg-background rounded-lg border border-border/30 p-4 flex items-center gap-3"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <PackageSearch size={18} className="text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
              <p className="text-xs text-muted-foreground">
                {s.productCount} producto{s.productCount !== 1 && "s"} &middot; {s.totalStock.toLocaleString("es-PE")} uds
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
