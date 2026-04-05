import { Product } from "@/types/inventory"
import { StockBadge } from "./StockBadge"

interface ProductCardListProps {
  products: Product[]
}

export function ProductCardList({ products }: ProductCardListProps) {
  if (products.length === 0) return <p className="py-12 text-center text-muted-foreground">No hay productos disponibles.</p>

  return (
    <div className="space-y-2">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center bg-card rounded-lg border border-border/40 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0 px-4 py-3">
            <div className="h-12 w-12 bg-brand-50 rounded-md border border-border flex items-center justify-center shrink-0">
              <div className="w-6 h-6 bg-brand-100 rounded-sm" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-foreground truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                <span>{product.category}</span>
                <span className="font-mono">#{product.sku}</span>
              </p>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <StockBadge status={product.stockStatus} stock={product.stock} />
              <span className="text-sm text-muted-foreground min-w-[100px] hidden md:block">{product.location}</span>
              <span className="font-semibold text-foreground tabular-nums min-w-[72px] text-right">
                S/ {product.unitPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
