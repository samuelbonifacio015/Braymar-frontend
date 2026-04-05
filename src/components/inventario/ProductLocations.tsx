import { Product, Location } from "@/types/inventory"
import { StockBadge } from "./StockBadge"
import { MapPin } from "lucide-react"

interface ProductLocationsProps {
  products: Product[]
}

const ALL_LOCATIONS: { value: Location; label: string }[] = [
  { value: "Almacén Tienda", label: "Almacén Tienda" },
  { value: "Cochera", label: "Cochera" },
  { value: "Cangallo", label: "Cangallo" },
  { value: "Santa Anita", label: "Santa Anita" },
]

export function ProductLocations({ products }: ProductLocationsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {ALL_LOCATIONS.map((loc) => {
        const locProducts = products.filter(p => p.location === loc.value)
        const totalStock = locProducts.reduce((sum, p) => sum + p.stock, 0)

        return (
          <div
            key={loc.value}
            className="bg-card rounded-lg border border-border/40 shadow-sm flex flex-col"
          >
            <div className="px-4 py-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-muted-foreground" />
                <h4 className="text-sm font-semibold text-foreground truncate">{loc.label}</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                {locProducts.length} producto{locProducts.length !== 1 ? "s" : ""} · {totalStock} uds
              </p>
            </div>

            <div className="p-2 space-y-1 flex-1 min-h-[80px]">
              {locProducts.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
                  Sin productos
                </div>
              ) : (
                locProducts.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 p-2.5 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <StockBadge status={p.stockStatus} stock={p.stock} />
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
