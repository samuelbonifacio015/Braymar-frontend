import { Product, StockStatus, Location } from "@/types/inventory"

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return "agotado"
  if (stock <= 20) return "bajo_stock"
  return "optimo"
}

export function computeInventoryStats(products: Product[]) {
  return {
    total: products.length,
    lowStock: products.filter(p => p.stockStatus === "bajo_stock").length,
    agotados: products.filter(p => p.stockStatus === "agotado").length,
    totalValue: products.reduce((sum, p) => sum + p.stock * p.unitPrice, 0),
  }
}

export interface LocationStats {
  productCount: number
  totalStock: number
  totalValue: number
  optimos: number
  bajoStock: number
  agotados: number
}

// Calcular estadisticas de un almacen individual
export function computeLocationStats(products: Product[]): LocationStats {
  return {
    productCount: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    totalValue: products.reduce((sum, p) => sum + p.stock * p.unitPrice, 0),
    optimos: products.filter(p => p.stockStatus === "optimo").length,
    bajoStock: products.filter(p => p.stockStatus === "bajo_stock").length,
    agotados: products.filter(p => p.stockStatus === "agotado").length,
  }
}
