import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Wallet, CreditCard, Smartphone, CheckCircle } from "lucide-react"
import type { PaymentMethod } from "@/types/sales"

const METHODS: { value: PaymentMethod; label: string; icon: typeof Wallet }[] = [
  { value: "efectivo", label: "Efectivo", icon: Wallet },
  { value: "yape_plin", label: "Yape / Plin", icon: Smartphone },
  { value: "tarjeta", label: "Tarjeta", icon: CreditCard },
]

interface PaymentSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  onConfirm: (method: PaymentMethod) => void
}

export function PaymentSelector({ open, onOpenChange, total, onConfirm }: PaymentSelectorProps) {
  const [method, setMethod] = useState<PaymentMethod>("efectivo")

  const handleConfirm = () => {
    onConfirm(method)
    setMethod("efectivo")
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) setMethod("efectivo")
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle size={20} className="text-brand-600" />
            Procesar Pago
          </DialogTitle>
          <DialogDescription>
            Seleccione el metodo de pago para completar la venta.
          </DialogDescription>
        </DialogHeader>

        { /* Monto total a pagar */ }
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Total a cobrar</p>
          <p className="text-3xl font-bold text-gray-900">S/ {total.toFixed(2)}</p>
        </div>

        { /* Selector de metodo de pago */ }
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Metodo de pago</p>
          {METHODS.map((m) => {
            const Icon = m.icon
            return (
              <button
                key={m.value}
                onClick={() => setMethod(m.value)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left",
                  method === m.value
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "shrink-0",
                    method === m.value ? "text-brand-600" : "text-gray-400",
                  )}
                />
                <span className={cn(
                  "text-sm font-medium",
                  method === m.value ? "text-brand-800" : "text-gray-700",
                )}>
                  {m.label}
                </span>
                {method === m.value && (
                  <CheckCircle size={18} className="ml-auto text-brand-600 shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="bg-brand-600 hover:bg-brand-700 text-white">
            Confirmar Venta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
