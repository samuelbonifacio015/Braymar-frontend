export type StockStatus = "optimo" | "bajo_stock" | "agotado"

export type Location = "Almacén Tienda" | "Cochera" | "Cangallo" | "Santa Anita"

export interface Product {
  id: string
  sku: string
  name: string
  stock: number
  stockStatus: StockStatus
  location: Location
  unitPrice: number
  wholesalePrice: number
  category: string
  imageUrl?: string
}
