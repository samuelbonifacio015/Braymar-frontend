"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Product } from "@/types/inventory"
import { StockBadge } from "./StockBadge"
import { DollarSign, Package, Weight, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

const PRESET_QTY = [1, 2, 3, 5, 10, 20]

interface PriceModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatWeight(kg: number): string {
  if (kg >= 1) return `${kg.toFixed(2)} kg`
  return `${(kg * 1000).toFixed(0)} g`
}

export function PriceModal({ product, open, onOpenChange }: PriceModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [useWholesale, setUseWholesale] = useState(false)

  // Reset on product change
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setQuantity(1)
      setUseWholesale(false)
    }
    onOpenChange(open)
  }

  if (!product) return null

  const unitPrice = product.unitPrice
  const wholesalePrice = product.wholesalePrice
  const unitsPerBox = product.unitsPerBox ?? 20
  const weightPerUnit = product.weightPerUnit ?? 0

  // Calculate
  const selectedPrice = useWholesale ? wholesalePrice : unitPrice
  const subtotal = selectedPrice * quantity
  const subtotalRetail = unitPrice * quantity
  const wholesaleSubtotal = wholesalePrice * quantity
  const savings = subtotalRetail - wholesaleSubtotal
  const discountPct = wholesalePrice < unitPrice
    ? (((unitPrice - wholesalePrice) / unitPrice) * 100).toFixed(0)
    : "0"

  const boxPrice = wholesalePrice * unitsPerBox
  const totalWeight = weightPerUnit * quantity
  const boxWeight = weightPerUnit * unitsPerBox

  const priceRows = [
    { label: `Precio minorista x${quantity}`, unit: unitPrice, total: unitPrice * quantity },
    { label: `Precio mayorista x${quantity} (-${discountPct}%)`, unit: wholesalePrice, total: wholesalePrice * quantity, discount: true },
    { label: `Por caja (${unitsPerBox} uds)`, unit: wholesalePrice, total: boxPrice, highlight: true },
  ]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-14 w-14 rounded-lg bg-brand-50 border border-border flex items-center justify-center shrink-0">
              <DollarSign className="text-brand-600" size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold leading-tight">{product.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground font-mono">#{product.sku}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{product.category}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <StockBadge status={product.stockStatus} stock={product.stock} />
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Stock & Weight Info */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/40 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Stock</p>
            <p className="text-lg font-bold tabular-nums">{product.stock}</p>
            <p className="text-[10px] text-muted-foreground">uds.</p>
          </div>
          {weightPerUnit > 0 && (
            <div className="bg-muted/40 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Weight size={12} /> Peso/ud
              </p>
              <p className="text-lg font-bold tabular-nums">{formatWeight(weightPerUnit)}</p>
              <p className="text-[10px] text-muted-foreground">caja: {formatWeight(boxWeight)}</p>
            </div>
          )}
          {unitsPerBox > 1 && (
            <div className="bg-muted/40 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Package size={12} /> x Caja
              </p>
              <p className="text-lg font-bold tabular-nums">{unitsPerBox}</p>
              <p className="text-[10px] text-muted-foreground">uds.</p>
            </div>
          )}
          {(weightPerUnit === 0 || weightPerUnit === undefined) && (
            <div className="bg-muted/40 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Tag size={12} /> Desc.
              </p>
              <p className="text-lg font-bold text-green-700">-{discountPct}%</p>
              <p className="text-[10px] text-muted-foreground">mayorista</p>
            </div>
          )}
          {weightPerUnit > 0 && unitsPerBox === 1 && (
            <div className="bg-muted/40 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Tag size={12} /> Desc.
              </p>
              <p className="text-lg font-bold text-green-700">-{discountPct}%</p>
              <p className="text-[10px] text-muted-foreground">mayorista</p>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div>
          <p className="text-sm font-medium mb-2">Cantidad</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_QTY.map((qty) => (
              <button
                key={qty}
                onClick={() => setQuantity(qty)}
                className={cn(
                  "h-9 min-w-[44px] px-3 rounded-lg text-sm font-medium transition-colors",
                  quantity === qty
                    ? "bg-brand-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {qty}
              </button>
            ))}
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-9 w-20 rounded-lg border border-input bg-background px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-600"
              aria-label="Cantidad personalizada"
            />
          </div>
        </div>

        {/* Price Table — focus section */}
        <div className="overflow-hidden rounded-lg border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-600 text-white">
                <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider">Concepto</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold uppercase tracking-wider">Precio/ud</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-card">
              <tr className="hover:bg-muted/20">
                <td className="py-3 px-4 font-medium text-sm">Minorista</td>
                <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">S/ {unitPrice.toFixed(2)}</td>
                <td className="py-3 px-4 text-right tabular-nums font-medium">S/ {(unitPrice * quantity).toFixed(2)}</td>
              </tr>
              <tr className="bg-green-50/50 hover:bg-green-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm">Mayorista</span>
                    <span className="inline-block bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">-{discountPct}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-green-700 font-medium">S/ {wholesalePrice.toFixed(2)}</td>
                <td className="py-3 px-4 text-right tabular-nums text-green-700 font-semibold">S/ {(wholesalePrice * quantity).toFixed(2)}</td>
              </tr>
              {unitsPerBox > 1 && (
                <tr className="bg-muted/30 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm">Caja ({unitsPerBox} uds)</span>
                      <span className="text-[10px] text-muted-foreground">peso: {formatWeight(boxWeight)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">—</td>
                  <td className="py-3 px-4 text-right tabular-nums font-semibold">S/ {boxPrice.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Savings Summary */}
        <div className="bg-brand-50 rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-700 font-medium">Ahorro al comprar mayorista</p>
            <p className="text-[10px] text-brand-600">por {quantity} unidades</p>
          </div>
          <p className="text-xl font-bold text-brand-700 tabular-nums">S/ {savings.toFixed(2)}</p>
        </div>

        {/* Weight Summary */}
        {weightPerUnit > 0 && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Weight size={12} />
              <span>Peso total: <strong className="text-foreground tabular-nums">{formatWeight(totalWeight)}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Package size={12} />
              <span>Peso caja: <strong className="text-foreground tabular-nums">{formatWeight(boxWeight)}</strong></span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
