import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/inventory"
import type { CartItem } from "@/types/sales"

interface ProductSearchProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function ProductSearch({ products, onAddToCart, searchTerm, onSearchChange }: ProductSearchProps) {
  // Filtrar productos por nombre o SKU
  const filtered = products.filter((p) => {
    const q = searchTerm.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-4">
      { /* Busqueda por nombre o SKU */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Buscar por nombre o SKU..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      { /* Grid compacto de productos */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No se encontraron productos.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
          {filtered.map((product) => (
            <button
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="flex flex-col gap-2 p-3 text-left rounded-lg border border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.stock <= 0}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{product.name}</p>
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="outline" className="text-[10px] shrink-0 border-amber-300 text-amber-600">
                    bajo
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-gray-500">SKU: {product.sku}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-brand-600">S/ {product.unitPrice.toFixed(2)}</span>
                <span className="text-xs text-gray-500">Stock: {product.stock}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Mayorista (x10+): S/ {product.wholesalePrice.toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
