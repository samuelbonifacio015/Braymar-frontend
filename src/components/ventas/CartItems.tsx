import { Trash2, Minus, Plus, ShoppingCart, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/types/sales"
interface CartItemsProps {
  cartItems: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onClear: () => void
  total: number
  onCheckout: () => void
}

export function CartItems({ cartItems, onUpdateQuantity, onRemove, onClear, total, onCheckout }: CartItemsProps) {
  return (
    <div className="flex flex-col h-full">
      { /* Encabezado del carrito */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-900">Carrito</h2>
          {cartItems.length > 0 && (
            <Badge className="bg-brand-600 text-white text-xs">{cartItems.length}</Badge>
          )}
        </div>
        {cartItems.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-xs text-gray-500 hover:text-red-600 h-7">
            <Trash2 size={13} className="mr-1" />
            Vaciar
          </Button>
        )}
      </div>

      { /* Lista de items en el carrito */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <ShoppingCart size={32} className="mb-2 opacity-50" />
            <p className="text-sm">Carrito vacio</p>
            <p className="text-xs mt-1">Agregue productos desde el panel izquierdo</p>
          </div>
        ) : (
          cartItems.map((item) => {
            const price = item.quantity >= 10 ? item.wholesalePrice : item.unitPrice
            const lineTotal = price * item.quantity
            return (
              <div key={item.productId} className="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                    <p className="text-[11px] text-gray-500">{item.sku}</p>
                  </div>
                  <button onClick={() => onRemove(item.productId)} className="text-gray-400 hover:text-red-500 shrink-0" title="Eliminar">
                    <Minus size={13} />
                  </button>
                </div>

                { /* Controles de cantidad */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  { /* Deteccion automatica de precio mayorista */}
                  {item.quantity >= 10 ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Mayorista</Badge>
                  ) : (
                    <span className="text-[10px] text-gray-400">Unitario</span>
                  )}

                  <span className="text-sm font-bold text-gray-900">S/ {lineTotal.toFixed(2)}</span>
                </div>
              </div>
            )
          })
        )}
      </div>

      { /* Total y boton cobrar */}
      {cartItems.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total a pagar</span>
            <span className="text-xl font-bold text-gray-900">S/ {total.toFixed(2)}</span>
          </div>
          <Button
            onClick={onCheckout}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white gap-2"
          >
            <Receipt size={16} />
            Cobrar
          </Button>
        </div>
      )}
    </div>
  )
}
