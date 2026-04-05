import { Product } from "@/types/inventory"
import { StockBadge } from "./StockBadge"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return <p className="py-12 text-center text-muted-foreground">No hay productos disponibles.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-card rounded-lg border border-border/40 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
        >
          <div className="aspect-video bg-muted flex items-center justify-center border-b border-border/40">
            <div className="w-14 h-14 bg-brand-50 rounded-lg border border-border flex items-center justify-center">
              <div className="w-8 h-8 bg-brand-100 rounded-sm" />
            </div>
          </div>

          <div className="p-4">
            <p className="font-semibold text-sm text-foreground truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <StockBadge status={product.stockStatus} stock={product.stock} />
              <span className="font-semibold text-sm text-foreground tabular-nums">S/ {product.unitPrice.toFixed(2)}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span>{product.location}</span>
              <span className="font-mono">#{product.sku}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
