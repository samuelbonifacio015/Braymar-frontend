import { Badge } from "@/components/ui/badge"
import { CircleCheck, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TransferStatus } from "@/types/transfers"

interface TransferStatusBadgeProps {
  status: TransferStatus
}

const statusMap: Record<
  TransferStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  completed: {
    label: "Completada",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    icon: CircleCheck,
  },
  pending: {
    label: "Pendiente",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelada",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    icon: XCircle,
  },
}

export function TransferStatusBadge({ status }: TransferStatusBadgeProps) {
  const config = statusMap[status]
  const Icon = config.icon

  return (
    <Badge
      className={cn("gap-1 font-normal", config.className)}
      variant="outline"
    >
      <Icon size={12} />
      {config.label}
    </Badge>
  )
}
