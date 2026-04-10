export type PaymentMethod = "efectivo" | "yape_plin" | "tarjeta"
export type PriceType = "unit" | "wholesale"

export interface CartItem {
  productId: string
  productName: string
  sku: string
  unitPrice: number
  wholesalePrice: number
  quantity: number
  priceType: PriceType
  stock: number
}

export interface SaleItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Sale {
  id: string
  items?: SaleItem[] // Optional for database queries (items fetched separately)
  total: number
  itemCount?: number // Database field: item_count
  paymentMethod: PaymentMethod
  saleBy: string
  createdAt: string
}
