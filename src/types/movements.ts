import type { Location } from "@/types/inventory"

export type MovementType = "entrada" | "salida" | "transferencia" | "ajuste"

export interface StockMovement {
  id: string
  productId: string
  productName: string
  sku: string
  type: MovementType
  quantity: number
  fromLocation?: Location
  toLocation?: Location
  notes?: string
  performedBy: string
  createdAt: string
}
