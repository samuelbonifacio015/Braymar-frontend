import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatFullDateTime } from "@/lib/date"
import type { StockMovement, MovementType } from "@/types/movements"
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Scale,
  Package,
  MapPin,
  User,
  Clock,
  FileText
} from "lucide-react"

const MOVEMENT_CONFIG: Record<MovementType, {
  icon: typeof ArrowDownLeft
  label: string
  iconBg: string
  iconColor: string
}> = {
  entrada: {
    icon: ArrowDownLeft,
    label: "Entrada",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  salida: {
    icon: ArrowUpRight,
    label: "Salida",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  transferencia: {
    icon: ArrowRightLeft,
    label: "Transferencia",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  ajuste: {
    icon: Scale,
    label: "Ajuste",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
}

interface MovementDetailModalProps {
  movement: StockMovement | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovementDetailModal({ movement, open, onOpenChange }: MovementDetailModalProps) {
  if (!movement) return null

  const config = MOVEMENT_CONFIG[movement.type]
  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", config.iconBg, config.iconColor)}>
              <Icon size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl">Detalle de {config.label}</DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-wider mt-0.5">
                Ref: {movement.id.toUpperCase()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-5">
          {/* Producto */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                <Package size={16} className="text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {movement.productName}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="text-[10px] font-mono text-gray-500 bg-white shadow-sm">
                    {movement.sku}
                  </Badge>
                  <span className={cn(
                    "text-xs font-bold px-1.5 py-0.5 rounded-md",
                    movement.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {movement.quantity > 0 ? "+" : ""}{movement.quantity} uds
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Origen */}
            {movement.fromLocation && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} /> Origen
                </p>
                <p className="text-sm font-medium text-gray-900">{movement.fromLocation}</p>
              </div>
            )}
            
            {/* Destino */}
            {movement.toLocation && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} /> Destino
                </p>
                <p className="text-sm font-medium text-gray-900">{movement.toLocation}</p>
              </div>
            )}

            {/* Fecha */}
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} /> Fecha y Hora
              </p>
              <p className="text-sm text-gray-900">{formatFullDateTime(movement.createdAt)}</p>
            </div>

            {/* Responsable */}
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <User size={12} /> Responsable
              </p>
              <p className="text-sm text-gray-900 capitalize">{movement.performedBy}</p>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={12} /> Notas del movimiento
            </p>
            {movement.notes ? (
              <div className="bg-amber-50/50 border border-amber-100/50 rounded-lg p-3 text-sm text-amber-900">
                {movement.notes}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No se agregaron notas a este movimiento.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
