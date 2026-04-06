"use client"

import { useState } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Scale,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatRelativeDate, formatFullDateTime } from "@/lib/date"
import type { StockMovement, MovementType } from "@/types/movements"

const PAGE_SIZE = 10

const MOVEMENT_CONFIG: Record<MovementType, {
  icon: typeof ArrowDownLeft
  label: string
  badgeVariant: "default" | "secondary" | "destructive" | "outline"
  iconBg: string
  iconColor: string
}> = {
  entrada: {
    icon: ArrowDownLeft,
    label: "Entrada",
    badgeVariant: "default",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  salida: {
    icon: ArrowUpRight,
    label: "Salida",
    badgeVariant: "destructive",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  transferencia: {
    icon: ArrowRightLeft,
    label: "Transferencia",
    badgeVariant: "outline",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  ajuste: {
    icon: Scale,
    label: "Ajuste",
    badgeVariant: "secondary",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
}

interface MovementTableProps {
  movements: StockMovement[]
}

export function MovementTable({ movements }: MovementTableProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(movements.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const pageMovements = movements.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-3">
      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-gray-500 text-[11px] tracking-wider whitespace-nowrap">TIEMPO</TableHead>
              <TableHead className="font-semibold text-gray-500 text-[11px] tracking-wider">PRODUCTO</TableHead>
              <TableHead className="font-semibold text-gray-500 text-[11px] tracking-wider">SKU</TableHead>
              <TableHead className="font-semibold text-gray-500 text-[11px] tracking-wider">TIPO</TableHead>
              <TableHead className="font-semibold text-gray-500 text-[11px] tracking-wider text-right">CANT.</TableHead>
              <TableHead className="font-semibold text-gray-500 text-[11px] tracking-wider">UBICACION</TableHead>
              <TableHead className="font-semibold text-gray-500 text-[11px] tracking-wider max-w-[140px]">NOTAS</TableHead>
              <TableHead className="font-semibold text-gray-500 text-[11px] tracking-wider whitespace-nowrap">RESP.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-40">
                  <div className="flex flex-col items-center text-gray-400">
                    <Package size={28} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium text-gray-500">Sin movimientos</p>
                    <p className="text-xs mt-1">No hay registros con los filtros actuales</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageMovements.map((m) => {
                const config = MOVEMENT_CONFIG[m.type]
                const Icon = config.icon
                return (
                  <TableRow key={m.id} className="hover:bg-gray-50/60 transition-colors duration-150">
                    <TableCell className="py-3 pr-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800 tabular-nums whitespace-nowrap">
                          {formatRelativeDate(m.createdAt)}
                        </p>
                        <p className="text-[10px] text-gray-400 whitespace-nowrap">
                          {formatFullDateTime(m.createdAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-sm font-medium text-gray-900">{m.productName}</p>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-400 tabular-nums">{m.sku}</TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-7 h-7 rounded-md flex items-center justify-center shrink-0", config.iconBg, config.iconColor)}>
                          <Icon size={14} />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{config.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className={cn(
                      "py-3 text-sm font-semibold text-right tabular-nums whitespace-nowrap",
                      m.quantity > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {m.quantity > 0 ? "+" : ""}{m.quantity}
                    </TableCell>
                    <TableCell className="py-3">
                      <LocationBadges fromLocation={m.fromLocation} toLocation={m.toLocation} />
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-400 max-w-[140px] truncate">
                      {m.notes ?? "—"}
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-500 whitespace-nowrap">{m.performedBy}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {movements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
            <Package size={28} className="mb-2 opacity-50" />
            <p className="text-sm font-medium text-gray-500">Sin movimientos</p>
            <p className="text-xs mt-1 text-center px-4">No hay registros con los filtros actuales</p>
          </div>
        ) : (
          pageMovements.map((m) => {
            const config = MOVEMENT_CONFIG[m.type]
            const Icon = config.icon
            return (
              <div
                key={m.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200"
              >
                {/* Header: time + type */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.iconBg, config.iconColor)}>
                      <Icon size={15} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{config.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{formatRelativeDate(m.createdAt)}</span>
                </div>

                {/* Product + quantity */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{m.productName}</p>
                    <p className="text-[11px] text-gray-400 tabular-nums">{m.sku} &middot; {formatFullDateTime(m.createdAt)}</p>
                  </div>
                  <span className={cn(
                    "text-lg font-bold tabular-nums shrink-0",
                    m.quantity > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {m.quantity > 0 ? "+" : ""}{m.quantity}
                  </span>
                </div>

                {/* Location + notes */}
                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                  <LocationBadges fromLocation={m.fromLocation} toLocation={m.toLocation} />
                  {m.notes && (
                    <p className="text-xs text-gray-400 mt-1.5 truncate">{m.notes}</p>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {movements.length > 0 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-gray-500">
            Mostrando {start + 1}–{Math.min(start + PAGE_SIZE, movements.length)} de {movements.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(1)}
              disabled={safePage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-xs tabular-nums text-gray-600 px-2 font-medium">
              {safePage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Renders compact location badges: "Desde" / "Hacia" with arrow for transfers.
 */
function LocationBadges({
  fromLocation,
  toLocation,
}: {
  fromLocation?: string
  toLocation?: string
}) {
  if (!fromLocation && !toLocation) return <span className="text-sm text-gray-400">—</span>

  return (
    <div className="flex items-center flex-wrap gap-1">
      {fromLocation && (
        <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0 h-5 border border-gray-200 bg-white text-gray-600">
          {fromLocation}
        </Badge>
      )}
      {fromLocation && toLocation && (
        <span className="text-gray-300 text-[10px]">→</span>
      )}
      {toLocation && (
        <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0 h-5 bg-brand-50 text-brand-700 border-brand-200">
          {toLocation}
        </Badge>
      )}
    </div>
  )
}
