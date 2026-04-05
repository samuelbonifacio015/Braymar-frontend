import type { Transfer } from "@/types/transfers"
import { ArrowRightLeft, CheckCircle2, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransferStatsProps {
  transfers: Transfer[]
}

export function TransferStats({ transfers }: TransferStatsProps) {
  const pending = transfers.filter((t) => t.status === "pending").length
  const completed = transfers.filter((t) => t.status === "completed").length
  const cancelled = transfers.filter((t) => t.status === "cancelled").length

  const cards = [
    {
      label: "Pendientes",
      value: pending,
      icon: Clock,
      className: "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
      iconClassName: "text-amber-500",
      valueClassName: "text-amber-700 dark:text-amber-400",
    },
    {
      label: "Completadas",
      value: completed,
      icon: CheckCircle2,
      className: "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
      iconClassName: "text-emerald-500",
      valueClassName: "text-emerald-700 dark:text-emerald-400",
    },
    {
      label: "Canceladas",
      value: cancelled,
      icon: XCircle,
      className: "border-l-red-500 bg-red-50/50 dark:bg-red-950/20",
      iconClassName: "text-red-500",
      valueClassName: "text-red-700 dark:text-red-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "rounded-lg border shadow-sm p-4 flex items-center gap-4 border-l-4",
            card.className,
          )}
        >
          <div className={cn("p-2 rounded-full bg-white dark:bg-card shadow-sm", card.iconClassName)}>
            <card.icon size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{card.label}</p>
            <p className={cn("text-2xl font-bold", card.valueClassName)}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
