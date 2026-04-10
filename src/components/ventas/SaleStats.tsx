import { TrendingUp, ShoppingCart, Wallet } from "lucide-react"
import type { Sale } from "@/types/sales"

interface SaleStatsProps {
  sales: Sale[]
  totalRevenue?: number
  transactionCount?: number
  averageTicket?: number
}

export function SaleStats({ sales, totalRevenue, transactionCount, averageTicket }: SaleStatsProps) {
  // Use provided stats from database if available, otherwise calculate from sales prop
  const today = new Date().toISOString().slice(0, 10)
  const todaySales = sales.filter((s) => s.createdAt.slice(0, 10) === today)

  const displayRevenue = totalRevenue ?? todaySales.reduce((sum, s) => sum + s.total, 0)
  const displayTransactions = transactionCount ?? todaySales.length
  const displayAvgTicket = averageTicket ?? (displayTransactions > 0 ? displayRevenue / displayTransactions : 0)

  const stats = [
    {
      label: "Ventas del Dia",
      value: `S/ ${displayRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Transacciones",
      value: String(displayTransactions),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Ticket Promedio",
      value: `S/ ${displayAvgTicket.toFixed(2)}`,
      icon: Wallet,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
