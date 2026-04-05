import { Product, StockStatus } from "@/types/inventory"

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
