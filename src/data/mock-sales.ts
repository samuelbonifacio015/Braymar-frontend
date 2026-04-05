export interface SaleMock {
  id: string
  total: number
  itemCount: number
  date: string
  paymentMethod: string
}

// Mock sales data (last 30 days)
export const mockSales: SaleMock[] = [
  { id: "sale-1", total: 156.50, itemCount: 8, date: "2026-04-05", paymentMethod: "efectivo" },
  { id: "sale-2", total: 89.90, itemCount: 1, date: "2026-04-05", paymentMethod: "yape_plin" },
  { id: "sale-3", total: 340.00, itemCount: 15, date: "2026-04-04", paymentMethod: "efectivo" },
  { id: "sale-4", total: 72.40, itemCount: 4, date: "2026-04-04", paymentMethod: "tarjeta" },
  { id: "sale-5", total: 225.00, itemCount: 10, date: "2026-04-03", paymentMethod: "efectivo" },
  { id: "sale-6", total: 45.50, itemCount: 2, date: "2026-04-03", paymentMethod: "yape_plin" },
  { id: "sale-7", total: 510.00, itemCount: 20, date: "2026-04-02", paymentMethod: "efectivo" },
  { id: "sale-8", total: 180.00, itemCount: 6, date: "2026-04-01", paymentMethod: "tarjeta" },
  { id: "sale-9", total: 95.80, itemCount: 5, date: "2026-04-01", paymentMethod: "efectivo" },
  { id: "sale-10", total: 67.00, itemCount: 3, date: "2026-03-31", paymentMethod: "yape_plin" },
]

// Mock daily sales for charts
export const dailySalesData: { date: string; revenue: number; units: number }[] = [
  { date: "03/29", revenue: 245.30, units: 18 },
  { date: "03/30", revenue: 189.00, units: 12 },
  { date: "03/31", revenue: 67.00, units: 3 },
  { date: "04/01", revenue: 185.80, units: 14 },
  { date: "04/02", revenue: 510.00, units: 20 },
  { date: "04/03", revenue: 270.50, units: 12 },
  { date: "04/04", revenue: 412.40, units: 19 },
  { date: "04/05", revenue: 246.40, units: 9 },
]
