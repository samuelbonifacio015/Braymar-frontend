import { useMemo } from "react"
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
import { getMovements } from "@/data/mock-movements"
import type { StockMovement, MovementType } from "@/types/movements"
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Scale,
  Package,
} from "lucide-react"

const MOVEMENT_CONFIG: Record<MovementType, {
  icon: typeof ArrowDownLeft
  label: string
  colorClass: string
  bgColorClass: string
  borderColorClass: string
}> = {
  entrada: { icon: ArrowDownLeft, label: "Entrada", colorClass: "text-green-600", bgColorClass: "bg-green-50", borderColorClass: "border-green-200" },
  salida: { icon: ArrowUpRight, label: "Salida", colorClass: "text-red-600", bgColorClass: "bg-red-50", borderColorClass: "border-red-200" },
  transferencia: { icon: ArrowRightLeft, label: "Transferencia", colorClass: "text-blue-600", bgColorClass: "bg-blue-50", borderColorClass: "border-blue-200" },
  ajuste: { icon: Scale, label: "Ajuste", colorClass: "text-purple-600", bgColorClass: "bg-purple-50", borderColorClass: "border-purple-200" },
}

interface ProductTimelineModalProps {
  productId: string | null
  productName: string | null
  productSku: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductTimelineModal({ productId, productName, productSku, open, onOpenChange }: ProductTimelineModalProps) {
  // Fetch movements for this specific product, sorted newest first
  const productMovements = useMemo(() => {
    if (!productId) return []
    return getMovements()
      .filter((m) => m.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [productId])

  if (!productId) return null

  // Calculate current stock from movements (simulated calculation)
  const currentStock = useMemo(() => {
    return productMovements.reduce((sum, m) => sum + m.quantity, 0)
  }, [productMovements])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Package size={20} className="text-gray-600" />
              </div>
              <div className="min-w-0 pr-4">
                <DialogTitle className="text-lg leading-tight truncate" title={productName || ""}>
                  {productName}
                </DialogTitle>
                <DialogDescription className="mt-1 flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono shadow-sm bg-white">
                    {productSku}
                  </Badge>
                  <span className="text-xs font-medium text-gray-500">
                    Stock Total Histórico: <span className="font-bold text-gray-900">{currentStock}</span>
                  </span>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-6 -mr-6 pl-2 -ml-2 py-4">
          <div className="relative border-l-2 border-gray-100 ml-4 space-y-6">
            {productMovements.length === 0 ? (
              <div className="pl-6 text-sm text-gray-500 py-4 italic">No hay historial para este producto.</div>
            ) : (
              productMovements.map((movement, idx) => {
                const config = MOVEMENT_CONFIG[movement.type]
                const Icon = config.icon
                const isLast = idx === productMovements.length - 1

                return (
                  <div key={movement.id} className="relative pl-8">
                    {/* Timeline Node Badge */}
                    <div className={cn(
                      "absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm",
                      config.bgColorClass,
                      config.colorClass
                    )}>
                      <Icon size={12} strokeWidth={3} />
                    </div>

                    <div className={cn(
                      "rounded-xl border p-3.5 shadow-sm transition-all",
                      config.borderColorClass,
                      "bg-white hover:bg-gray-50/50"
                    )}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            {config.label}
                            <span className={cn(
                              "text-xs font-bold px-1.5 py-0.5 rounded-md",
                              movement.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                              {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                            </span>
                          </p>
                          <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                            {formatFullDateTime(movement.createdAt)}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Responsable</p>
                          <p className="text-xs text-gray-700 capitalize">{movement.performedBy}</p>
                        </div>
                      </div>

                      {/* Locations Row */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        {movement.fromLocation && (
                          <Badge variant="secondary" className="text-[10px] font-normal h-5 bg-gray-100">
                            {movement.fromLocation}
                          </Badge>
                        )}
                        {movement.fromLocation && movement.toLocation && (
                          <span className="text-gray-300 text-[10px]">→</span>
                        )}
                        {movement.toLocation && (
                          <Badge variant="outline" className="text-[10px] font-normal h-5 border-gray-200 bg-white">
                            {movement.toLocation}
                          </Badge>
                        )}
                      </div>

                      {/* Notes Box */}
                      {movement.notes && (
                        <div className="mt-3 bg-gray-50 border border-gray-100 rounded-md p-2.5">
                          <p className="text-xs text-gray-600 line-clamp-2" title={movement.notes}>
                            <span className="font-semibold text-gray-500 mr-1">Nota:</span>
                            {movement.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 pt-4 border-t border-gray-100 mt-2">
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cerrar Timeline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
