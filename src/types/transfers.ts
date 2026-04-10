import type { Location } from "@/types/inventory"

export type TransferStatus = "pending" | "completed" | "cancelled"
export type ArchiveStatus = "active" | "archived"

export interface Transfer {
  id: string
  productId: string
  productName: string
  sku: string
  origin: Location
  destination: Location
  quantity: number
  requestedBy: string
  notes?: string
  status: TransferStatus
  archived?: ArchiveStatus // New field for archiving transfers
  createdAt: string
}
