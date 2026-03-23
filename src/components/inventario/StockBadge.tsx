import { Badge } from "@/components/ui/badge"
import { StockStatus } from "@/types/inventory"

interface StockBadgeProps {
  status: StockStatus
  stock: number
}

export function StockBadge({ status, stock }: StockBadgeProps) {
  let bgColor = ""
  let textColor = ""
  let label = ""

  switch (status) {
    case "optimo":
      bgColor = "bg-green-100"
      textColor = "text-green-800"
      label = "Óptimo"
      break
    case "bajo_stock":
      bgColor = "bg-yellow-100"
      textColor = "text-yellow-800"
      label = "Bajo Stock"
      break
    case "agotado":
      bgColor = "bg-red-100"
      textColor = "text-red-800"
      label = "Agotado"
      break
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <span className={`text-sm font-medium ${status === "agotado" ? "text-red-500" : status === "bajo_stock" ? "text-yellow-600" : "text-green-500"}`}>
        Stock {stock}
      </span>
      <Badge variant="outline" className={`${bgColor} ${textColor} border-transparent font-medium`}>
        {label}
      </Badge>
    </div>
  )
}
