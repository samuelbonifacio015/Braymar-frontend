import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, ListFilter } from "lucide-react"
import type { StockMovement, MovementType } from "@/types/movements"
import { isToday } from "@/lib/date"

const TYPE_CONFIG: Record<
  Exclude<MovementType, "ajuste">,
  { icon: typeof ArrowDownLeft; label: string; color: string; bg: string }
> = {
  entrada: {
    icon: ArrowDownLeft,
    label: "Entradas",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  salida: {
    icon: ArrowUpRight,
    label: "Salidas",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  transferencia: {
    icon: ArrowRightLeft,
    label: "Transferencias",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
}

interface StatsCardsProps {
  movements: StockMovement[]
}

/**
 * Stats cards showing today's movement summary.
 * 4 cards in a responsive grid: Total, Entradas, Salidas, Transferencias.
 */
export function StatsCards({ movements }: StatsCardsProps) {
  const todayMovements = movements.filter((m) => isToday(m.createdAt))

  const totalToday = todayMovements.length
  const entradasToday = todayMovements.filter((m) => m.type === "entrada").length
  const salidasToday = todayMovements.filter((m) => m.type === "salida").length
  const transfToday = todayMovements.filter((m) => m.type === "transferencia").length

  const cards = [
    {
      label: "Total hoy",
      value: totalToday,
      icon: ListFilter,
      color: "text-gray-900",
      bg: "bg-gray-50",
      accent: "border-gray-300",
      iconBg: "bg-gray-100 text-gray-500",
    },
    {
      label: "Entradas",
      value: entradasToday,
      icon: TYPE_CONFIG.entrada.icon,
      color: TYPE_CONFIG.entrada.color,
      bg: "bg-white",
      accent: "border-green-400",
      iconBg: TYPE_CONFIG.entrada.bg + " " + TYPE_CONFIG.entrada.color,
    },
    {
      label: "Salidas",
      value: salidasToday,
      icon: TYPE_CONFIG.salida.icon,
      color: TYPE_CONFIG.salida.color,
      bg: "bg-white",
      accent: "border-red-400",
      iconBg: TYPE_CONFIG.salida.bg + " " + TYPE_CONFIG.salida.color,
    },
    {
      label: "Transferencias",
      value: transfToday,
      icon: TYPE_CONFIG.transferencia.icon,
      color: TYPE_CONFIG.transferencia.color,
      bg: "bg-white",
      accent: "border-blue-400",
      iconBg: TYPE_CONFIG.transferencia.bg + " " + TYPE_CONFIG.transferencia.color,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={`rounded-xl border-l-4 ${card.accent} border bg-white shadow-sm p-4 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className={`text-2xl font-bold tabular-nums mt-0.5 ${card.color}`}>
                  {card.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
