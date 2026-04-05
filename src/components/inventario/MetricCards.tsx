import { Package, AlertTriangle, AlertCircle, DollarSign } from "lucide-react"

interface MetricCardsProps {
  total: number
  lowStock: number
  agotados: number
  totalValue: number
}

interface MetricCardData {
  label: string
  value: string
  icon: React.ElementType
  color: string
  bgIcon: string
}

export function MetricCards({ total, lowStock, agotados, totalValue }: MetricCardsProps) {
  const metrics: MetricCardData[] = [
    {
      label: "Total Productos",
      value: total.toString(),
      icon: Package,
      color: "text-foreground",
      bgIcon: "bg-muted",
    },
    {
      label: "Bajo Stock",
      value: lowStock.toString(),
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgIcon: "bg-yellow-50",
    },
    {
      label: "Agotados",
      value: agotados.toString(),
      icon: AlertCircle,
      color: "text-red-500",
      bgIcon: "bg-red-50",
    },
    {
      label: "Valor Inventario",
      value: `S/ ${totalValue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-foreground",
      bgIcon: "bg-muted",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-card rounded-xl border border-border/40 shadow-sm p-4 flex items-center gap-3"
        >
          <div className={`shrink-0 w-10 h-10 rounded-full ${m.bgIcon} flex items-center justify-center`}>
            <m.icon size={18} className={m.color} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{m.label}</p>
            <p className={`text-xl font-semibold ${m.color} leading-tight tabular-nums`}>{m.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
