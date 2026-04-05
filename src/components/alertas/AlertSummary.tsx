import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertSummaryProps {
  urgentCount: number
  warningCount: number
  infoCount: number
}

export function AlertSummary({
  urgentCount,
  warningCount,
  infoCount,
}: AlertSummaryProps) {
  const items = [
    {
      label: "Urgentes",
      count: urgentCount,
      icon: AlertCircle,
      className: "bg-red-600 text-white",
    },
    {
      label: "Advertencias",
      count: warningCount,
      icon: AlertTriangle,
      className: "bg-amber-500 text-white",
    },
    {
      label: "Informativas",
      count: infoCount,
      icon: Info,
      className: "bg-sky-600 text-white",
    },
  ]

  return (
    <div className="flex items-center gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 shadow-sm text-sm font-medium",
            item.className,
          )}
        >
          <item.icon size={16} />
          <span>{item.count}</span>
        </div>
      ))}
    </div>
  )
}
