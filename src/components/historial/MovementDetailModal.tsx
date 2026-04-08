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
  FileText,
  Hash
} from "lucide-react"

const MOVEMENT_CONFIG: Record<MovementType, {
  icon: typeof ArrowDownLeft
  label: string
  gradient: string
  iconBg: string
  iconColor: string
  textColor: string
}> = {
  entrada: {
    icon: ArrowDownLeft,
    label: "Entrada",
    gradient: "from-emerald-400/20 via-emerald-100/50 to-transparent",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    textColor: "text-emerald-950"
  },
  salida: {
    icon: ArrowUpRight,
    label: "Salida",
    gradient: "from-rose-400/20 via-rose-100/50 to-transparent",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    textColor: "text-rose-950"
  },
  transferencia: {
    icon: ArrowRightLeft,
    label: "Transferencia",
    gradient: "from-blue-400/20 via-blue-100/50 to-transparent",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    textColor: "text-blue-950"
  },
  ajuste: {
    icon: Scale,
    label: "Ajuste",
    gradient: "from-fuchsia-400/20 via-fuchsia-100/50 to-transparent",
    iconBg: "bg-fuchsia-100",
    iconColor: "text-fuchsia-700",
    textColor: "text-fuchsia-950"
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
      <DialogContent className="sm:max-w-md overflow-hidden p-0 md:p-0 gap-0 border-0 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
        
        {/* Full-bleed Header Banner con gradiente atmosférico */}
        <div className={cn("relative px-6 pt-8 pb-10 sm:px-8", "bg-gradient-to-b", config.gradient)}>
          {/* Patrón superpuesto sutil */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] mix-blend-multiply pointer-events-none" />
          
          <DialogHeader className="relative z-10 flex flex-row items-start justify-between space-y-0 text-left">
            <div className="flex flex-col gap-3">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-white/50 backdrop-blur-md", config.iconBg, config.iconColor)}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <div className="space-y-1 mt-1">
                <DialogTitle className={cn("text-2xl font-bold tracking-tight", config.textColor)}>
                  {config.label}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <Hash size={12} className="opacity-50" /> Ref: {movement.id}
                </DialogDescription>
              </div>
            </div>
            
            {/* Tag de cantidad estelar */}
            <div className={cn(
              "px-3 py-1.5 rounded-full text-sm font-black tracking-tight mt-1 border shadow-sm backdrop-blur-md",
              movement.quantity > 0 
                ? "bg-emerald-50/80 text-emerald-700 border-emerald-200" 
                : "bg-rose-50/80 text-rose-700 border-rose-200"
            )}>
              {movement.quantity > 0 ? "+" : ""}{movement.quantity} uds
            </div>
          </DialogHeader>
        </div>

        {/* Cuerpo del Modal con Glassmorphism suave */}
        <div className="px-6 pb-6 sm:px-8 bg-white relative z-20">
          
          {/* Tarjeta del producto solapada (overlapping) para romper la retícula plana */}
          <div className="-mt-6 mb-6 p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/[0.02]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <Package size={20} className="text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {movement.productName}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="secondary" className="text-[10px] uppercase font-mono tracking-wider bg-gray-100 text-gray-600 hover:bg-gray-100">
                    SKU: {movement.sku}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {/* Detalle: Bloque de Origen/Destino */}
            <div className="col-span-2 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Ruta logística</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {movement.fromLocation && (
                  <div className="flex-1 rounded-xl bg-gray-50/50 border border-gray-100 p-3 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin size={12} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Origen</p>
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{movement.fromLocation}</p>
                    </div>
                  </div>
                )}
                
                {movement.fromLocation && movement.toLocation && (
                  <div className="flex items-center justify-center -my-2 sm:my-0 z-10 shrink-0">
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-300 rotate-90 sm:rotate-0">
                      <ArrowRightLeft size={10} />
                    </div>
                  </div>
                )}

                {movement.toLocation && (
                  <div className="flex-1 rounded-xl bg-gray-50/50 border border-gray-100 p-3 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin size={12} className="text-brand-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-brand-500/80 uppercase tracking-wider">Destino</p>
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{movement.toLocation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Metadatos secundarios */}
            <div className="col-span-1 border-t border-gray-100/80 pt-4 mt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Clock size={12} /> Instante
              </p>
              <p className="text-sm font-medium text-gray-800">{formatFullDateTime(movement.createdAt)}</p>
            </div>

            <div className="col-span-1 border-t border-gray-100/80 pt-4 mt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <User size={12} /> Responsable
              </p>
              <p className="text-sm font-medium text-gray-800 capitalize flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase border border-gray-200">
                  {movement.performedBy.charAt(0)}
                </span>
                {movement.performedBy}
              </p>
            </div>

            {/* Notas con destaque especial */}
            <div className="col-span-2 mt-2">
              <div className="rounded-xl overflow-hidden ring-1 ring-amber-100/80">
                <div className="bg-amber-50/40 px-4 py-2 border-b border-amber-100/50 flex items-center gap-2">
                  <FileText size={14} className="text-amber-600" />
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Notas adjuntas</span>
                </div>
                <div className="bg-amber-50/20 p-4 min-h-[60px]">
                  {movement.notes ? (
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      "{movement.notes}"
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No se registraron notas en el movimiento.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ya no usamos DialogFooter para no romper el full-bleed, pero podriamos incluir un boton */}
        <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 sm:px-8 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto shadow-sm rounded-xl">
            Cerrar detalle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
