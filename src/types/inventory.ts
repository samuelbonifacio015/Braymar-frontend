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
  cost?: number // Costo de adquisición base
  categoryId: string
  category: string  // denormalized — nombre derivado del join con categories
  imageUrl?: string
  unitsPerBox?: number    // unidades por caja/paquete
}

export interface Category {
  id: string
  name: string
  slug: string
  color: string
  icon: string
  description: string
  createdAt: string
}
