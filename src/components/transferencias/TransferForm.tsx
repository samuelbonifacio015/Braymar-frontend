"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types/inventory"
import { Location } from "@/types/inventory"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, PackageSearch } from "lucide-react"
import { cn } from "@/lib/utils"

type NewTransfer = {
  productId: string
  origin: Location
  destination: Location
  quantity: number
  notes: string
}

interface TransferFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  onSubmit: (transfer: NewTransfer) => void
}

const LOCATIONS: Location[] = [
  "Almacén Tienda",
  "Cochera",
  "Cangallo",
  "Santa Anita",
]

export function TransferForm({
  open,
  onOpenChange,
  products,
  onSubmit,
}: TransferFormProps) {
  const [productId, setProductId] = useState("")
  const [origin, setOrigin] = useState<Location | "">("")
  const [destination, setDestination] = useState<Location | "">("")
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")

  // Validaciones
  const selectedProduct = products.find((p) => p.id === productId)
  const quantityNum = parseInt(quantity) || 0
  const originIsDifferent = origin && destination && origin !== destination
  const hasInsufficientStock =
    selectedProduct && origin && quantityNum > 0
      ? selectedProduct.stock < quantityNum
      : false

  const canSubmit =
    productId && origin && destination && originIsDifferent && quantityNum > 0

  // Reiniciar formulario al abrir
  useEffect(() => {
    if (open) {
      setProductId("")
      setOrigin("")
      setDestination("")
      setQuantity("")
      setNotes("")
    }
  }, [open])

  const handleSubmit = () => {
    if (!canSubmit || !selectedProduct || !origin || !destination) return
    onSubmit({
      productId,
      origin: origin as Location,
      destination: destination as Location,
      quantity: quantityNum,
      notes: notes.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Transferencia</DialogTitle>
          <DialogDescription>
            Seleccione un producto, origen y destino para crear una transferencia de stock.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* Selector de producto */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Producto <span className="text-red-500">*</span>
            </label>
            <Select
              value={productId}
              onValueChange={(val: string | null) => val && setProductId(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {products.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground flex items-center gap-2">
                    <PackageSearch size={14} />
                    No hay productos disponibles
                  </div>
                ) : (
                  products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Stock disponible del producto seleccionado */}
          {selectedProduct && (
            <div
              className={cn(
                "text-xs px-3 py-2 rounded-md border",
                hasInsufficientStock
                  ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                  : "bg-muted/30 border-border",
              )}
            >
              Stock disponible en {selectedProduct.location}: {selectedProduct.stock} unidades
            </div>
          )}

          {/* Advertencia de stock insuficiente */}
          {hasInsufficientStock && (
            <div className="flex items-start gap-2 text-xs bg-red-50 border border-red-200 rounded-md px-3 py-2 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              Stock insuficiente en el origen para esta cantidad. Considere reducir la cantidad o reabastecer primero.
            </div>
          )}

          {/* Origen y Destino */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Origen <span className="text-red-500">*</span>
              </label>
              <Select
                value={origin}
                onValueChange={(val: string | null) => val && setOrigin(val as Location)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Origen" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Destino <span className="text-red-500">*</span>
              </label>
              <Select
                value={destination}
                onValueChange={(val: string | null) => val && setDestination(val as Location)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Destino" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error: origen igual a destino */}
          {origin && destination && !originIsDifferent && (
            <div className="flex items-start gap-2 text-xs bg-red-50 border border-red-200 rounded-md px-3 py-2 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              El origen y el destino no pueden ser la misma ubicacion.
            </div>
          )}

          {/* Cantidad */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ej. 50"
            />
          </div>

          {/* Notas */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Notas (opcional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-brand-600 hover:bg-brand-700 text-white"
            onClick={handleSubmit}
            disabled={!canSubmit || hasInsufficientStock}
          >
            Crear Transferencia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
