import { Bell, AlertCircle, AlertTriangle, Info } from "lucide-react"

interface AlertMetricCardsProps {
  totalCount: number
  urgentCount: number
  warningCount: number
  infoCount: number
}

interface MetricData {
  label: string
  value: number
  icon: React.ElementType
  iconColor: string
  bgIcon: string
  valueColor: string
}

export function AlertMetricCards({
  totalCount,
  urgentCount,
  warningCount,
  infoCount,
}: AlertMetricCardsProps) {
  const metrics: MetricData[] = [
    {
      label: "Total Alertas",
      value: totalCount,
      icon: Bell,
      iconColor: "text-brand-600",
      bgIcon: "bg-brand-100",
      valueColor: "text-foreground",
    },
    {
      label: "Urgentes",
      value: urgentCount,
      icon: AlertCircle,
      iconColor: "text-red-600",
      bgIcon: "bg-red-50",
      valueColor: urgentCount > 0 ? "text-red-600" : "text-foreground",
    },
    {
      label: "Advertencias",
      value: warningCount,
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      bgIcon: "bg-amber-50",
      valueColor: warningCount > 0 ? "text-amber-600" : "text-foreground",
    },
    {
      label: "Informativas",
      value: infoCount,
      icon: Info,
      iconColor: "text-sky-600",
      bgIcon: "bg-sky-50",
      valueColor: infoCount > 0 ? "text-sky-600" : "text-foreground",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-card rounded-xl border border-border/40 shadow-sm p-4 flex items-center gap-3 transition-shadow hover:shadow-md"
        >
          <div
            className={`shrink-0 w-10 h-10 rounded-full ${m.bgIcon} flex items-center justify-center`}
          >
            <m.icon size={18} className={m.iconColor} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {m.label}
            </p>
            <p
              className={`text-xl font-semibold leading-tight tabular-nums ${m.valueColor}`}
            >
              {m.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
