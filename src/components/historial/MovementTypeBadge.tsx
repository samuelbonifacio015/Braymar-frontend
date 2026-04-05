import { cn } from "@/lib/utils"
import type { MovementType } from "@/types/movements"

const TYPE_LABELS: Record<MovementType, string> = {
  entrada: "Entrada",
  salida: "Salida",
  transferencia: "Transferencia",
  ajuste: "Ajuste",
}

interface MovementTypeBadgeProps {
  type: MovementType
}

export function MovementTypeBadge({ type }: MovementTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        type === "entrada" && "bg-green-100 text-green-800",
        type === "salida" && "bg-red-100 text-red-800",
        type === "transferencia" && "bg-blue-100 text-blue-800",
        type === "ajuste" && "bg-purple-100 text-purple-800",
      )}
    >
      {TYPE_LABELS[type]}
    </span>
  )
}
