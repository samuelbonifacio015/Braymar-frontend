"use client"

import { useState, useMemo } from "react"
import { Product, Location } from "@/types/inventory"
import { StockBadge } from "./StockBadge"
import { PriceModal } from "./PriceModal"
import { Warehouse, ChevronDown, ChevronUp, Package, AlertTriangle, AlertCircle, MapPin } from "lucide-react"
import { computeLocationStats } from "@/lib/inventory"
import { cn } from "@/lib/utils"

// Colores de acento para diferenciar cada almacen visualmente
const LOCATION_ACCENT = {
  "Almac\u00e9n Tienda": "bg-brand-600 text-white",
  "Cochera": "bg-slate-600 text-white",
  "Cangallo": "bg-orange-500 text-white",
  "Santa Anita": "bg-teal-600 text-white",
} as const satisfies Record<Location, string>

const LOCATION_ICON_COLORS: Record<Location, string> = {
  "Almac\u00e9n Tienda": "text-brand-600",
  "Cochera": "text-slate-600",
  "Cangallo": "text-orange-500",
  "Santa Anita": "text-teal-600",
}

const ALL_LOCATIONS: { value: Location; label: string }[] = [
  { value: "Almac\u00e9n Tienda", label: "Almac\u00e9n Tienda" },
  { value: "Cochera", label: "Cochera" },
  { value: "Cangallo", label: "Cangallo" },
  { value: "Santa Anita", label: "Santa Anita" },
]

interface ProductLocationsProps {
  products: Product[]
}

// ── Barra de salud de stock ──────────────────────────────────────────────
function StockHealthBar({ optimo, bajoStock, agotados }: { optimo: number; bajoStock: number; agotados: number }) {
  const total = optimo + bajoStock + agotados
  if (total === 0) return null

  const pctOpt = (optimo / total) * 100
  const pctLow = (bajoStock / total) * 100
  const pctAgot = (agotados / total) * 100

  return (
    <div className="flex h-1.5 rounded-full overflow-hidden bg-muted/50 mx-4 mt-1">
      {optimo > 0 && <div className="bg-green-500 transition-all duration-300" style={{ width: `${pctOpt}%` }} />}
      {bajoStock > 0 && <div className="bg-yellow-400 transition-all duration-300" style={{ width: `${pctLow}%` }} />}
      {agotados > 0 && <div className="bg-red-500 transition-all duration-300" style={{ width: `${pctAgot}%` }} />}
    </div>
  )
}

// ── Fila de producto expandible ──────────────────────────────────────────
function ProductRow({ product, onClick }: { product: Product; onClick: (p: Product) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-muted/60 transition-colors cursor-pointer text-left w-full group"
    >
      <Package size={14} className="text-muted-foreground shrink-0 mt-0.5" />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{product.name}</span>
          {product.sku && (
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums shrink-0 hidden sm:inline">{product.sku}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground tabular-nums">Stock: {product.stock}</span>
          {product.category && (
            <span className="text-[10px] text-muted-foreground truncate hidden md:inline">· {product.category}</span>
          )}
        </div>
      </div>

      <StockBadge status={product.stockStatus} stock={product.stock} />

      <span className="text-sm font-semibold tabular-nums text-foreground shrink-0 hidden sm:inline">
        S/ {product.unitPrice.toFixed(2)}
      </span>

      <ChevronDown
        size={14}
        className="text-muted-foreground shrink-0 -rotate-90 transition-transform group-hover:text-foreground"
      />
    </button>
  )
}

// ── Tarjeta de almacen ───────────────────────────────────────────────────
function LocationCard({
  location,
  locProducts,
  isExpanded,
  onToggle,
  onProductClick,
}: {
  location: { value: Location; label: string }
  locProducts: Product[]
  isExpanded: boolean
  onToggle: () => void
  onProductClick: (p: Product) => void
}) {
  const stats = useMemo(() => computeLocationStats(locProducts), [locProducts])

  return (
    <div className="bg-card rounded-lg border border-border/40 shadow-sm flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      {/* Header — siempre visible y clickable para expand/colapsar */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-3 px-4 py-3 text-left w-full cursor-pointer hover:bg-muted/30 transition-colors"
      >
        {/* Icono circular con color de acento */}
        <div className={cn("flex items-center justify-center w-8 h-8 rounded-full shrink-0", LOCATION_ACCENT[location.value as Location])}>
          <Warehouse size={15} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-semibold text-foreground truncate">{location.label}</h4>
            {isExpanded ? <ChevronUp size={14} className="text-muted-foreground shrink-0" /> : <ChevronDown size={14} className="text-muted-foreground shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
            {stats.productCount} producto{stats.productCount !== 1 ? "s" : ""} · {stats.totalStock} uds
          </p>

          {/* Pildoras de alerta */}
          {stats.bajoStock > 0 || stats.agotados > 0 ? (
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {stats.bajoStock > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded-sm">
                  <AlertTriangle size={10} className="text-yellow-600" />
                  {stats.bajoStock} bajo stock
                </span>
              )}
              {stats.agotados > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-700 bg-red-50 px-1.5 py-0.5 rounded-sm">
                  <AlertCircle size={10} className="text-red-600" />
                  {stats.agotados} agotado{stats.agotados !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          ) : null}
        </div>
      </button>

      {/* Barra de salud de stock */}
      <StockHealthBar optimo={stats.optimos} bajoStock={stats.bajoStock} agotados={stats.agotados} />

      {/* Lista de productos expandible */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-2 space-y-0.5 border-t border-border/40 mt-1">
          {locProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <MapPin size={20} className="mb-2 opacity-40" />
              <p className="text-xs font-medium">Sin productos en esta ubicaci\u00f3n</p>
            </div>
          ) : (
            locProducts.map(p => (
              <ProductRow key={p.id} product={p} onClick={onProductClick} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────
export function ProductLocations({ products }: ProductLocationsProps) {
  // Por defecto: todas expandidas en desktop, colapsadas en mobile
  const [expandedLocations, setExpandedLocations] = useState<Set<Location>>(
    () => new Set(ALL_LOCATIONS.map(l => l.value))
  )
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const toggleLocation = (loc: Location) => {
    setExpandedLocations(prev => {
      const next = new Set(prev)
      if (next.has(loc)) next.delete(loc)
      else next.add(loc)
      return next
    })
  }

  const handleProductClick = (p: Product) => {
    setSelectedProduct(p)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ALL_LOCATIONS.map(loc => {
          const locProducts = products.filter(p => p.location === loc.value)
          const isExpanded = expandedLocations.has(loc.value)

          return (
            <LocationCard
              key={loc.value}
              location={loc}
              locProducts={locProducts}
              isExpanded={isExpanded}
              onToggle={() => toggleLocation(loc.value)}
              onProductClick={handleProductClick}
            />
          )
        })}
      </div>

      <PriceModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => { if (!open) setSelectedProduct(null) }}
      />
    </>
  )
}
