import type { Location } from "@/types/inventory"

export type ReportType = "stock_general" | "valor_almacen" | "mas_vendidos" | "margenes" | "movimientos"
export type ReportPeriod = "today" | "week" | "month" | "custom"

export interface ReportFilter {
  period: ReportPeriod
  startDate?: string
  endDate?: string
  location?: Location
  category?: string
}

export interface SalesData {
  productId: string
  productName: string
  unitsSold: number
  revenue: number
}

export interface StockByWarehouse {
  location: Location
  productCount: number
  totalStock: number
  totalValue: number
}

export interface MarginRow {
  productId: string
  productName: string
  category: string
  unitPrice: number
  wholesalePrice: number
  marginPercent: number
}
