import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  Receipt,
  Package,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/types/sales"

const WHOLESALE_THRESHOLD = 10

interface CartItemsProps {
  cartItems: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onClear: () => void
  total: number
  onCheckout: () => void
  isCheckingOut?: boolean
}

// Helper: generate initials from product name for avatar placeholder
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

// Consistent pastel background colors for product avatars
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
  "bg-teal-100 text-teal-700",
]

function getAvatarColor(productId: string): string {
  const hash = productId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export function CartItems({
  cartItems,
  onUpdateQuantity,
  onRemove,
  onClear,
  total,
  onCheckout,
  isCheckingOut = false,
}: CartItemsProps) {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const wholesaleItems = cartItems.filter((i) => i.quantity >= WHOLESALE_THRESHOLD)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <ShoppingCart size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 leading-tight">
              Carrito
            </h2>
            <p className="text-[11px] text-gray-500 leading-tight">
              {cartItems.length === 0
                ? "Sin productos"
                : `${cartItems.length} producto${cartItems.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {cartItems.length > 1 && (
          <button
            onClick={onClear}
            className="min-h-[32px] h-8 px-3 text-xs font-medium text-gray-500 hover:text-red-600 bg-white border border-gray-200 rounded-lg transition-all duration-200 cursor-pointer hover:border-red-200 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
            aria-label="Vaciar carrito"
          >
            <Trash2 size={13} className="inline mr-1 -mt-0.5" />
            Vaciar
          </button>
        )}
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-3 border border-gray-100">
              <Package size={28} className="opacity-40" />
            </div>
            <p className="text-sm font-medium text-gray-500">Carrito vacio</p>
            <p className="text-xs mt-1 text-center max-w-[200px] text-gray-400">
              Busque y agregue productos desde el panel izquierdo
            </p>
          </div>
        ) : (
          cartItems.map((item, index) => {
            const isWholesale = item.quantity >= WHOLESALE_THRESHOLD
            const price = isWholesale ? item.wholesalePrice : item.unitPrice
            const lineTotal = price * item.quantity
            const missingForWholesale = Math.max(
              0,
              WHOLESALE_THRESHOLD - item.quantity
            )

            return (
              <div
                key={item.productId}
                className="group rounded-xl border border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:shadow-md hover:shadow-gray-200/50 hover:border-gray-300"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-stretch p-3 gap-3">
                  {/* Product avatar */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold tracking-wide",
                      getAvatarColor(item.productId)
                    )}
                  >
                    {getInitials(item.productName)}
                  </div>

                  {/* Product info + controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
                    {/* Name + SKU */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-gray-400 tabular-nums">
                        {item.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {/* Quantity controls */}
                      <div className="flex items-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.productId,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 transition-colors cursor-pointer"
                            aria-label="Reducir cantidad"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-bold tabular-nums border-x border-gray-200 py-2 leading-none flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.productId,
                                Math.min(item.stock, item.quantity + 1)
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 transition-colors cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Price + Wholesale badge */}
                      <div className="flex items-center gap-1.5">
                        {isWholesale ? (
                          <Badge className="bg-green-50 text-green-700 border border-green-200 text-[11px] font-medium px-1.5 py-0">
                            Mayorista
                          </Badge>
                        ) : (
                          missingForWholesale > 0 &&
                          missingForWholesale < WHOLESALE_THRESHOLD && (
                            <span className="text-[11px] text-orange-600 font-medium">
                              +{missingForWholesale} mayorista
                            </span>
                          )
                        )}
                      </div>

                      {/* Line total */}
                      <span className="text-sm font-bold tabular-nums text-gray-900 shrink-0">
                        S/ {lineTotal.toFixed(2)}
                      </span>

                      {/* Remove button */}
                      <button
                        onClick={() => onRemove(item.productId)}
                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200 shrink-0 cursor-pointer"
                        aria-label={`Eliminar ${item.productName}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Wholesale progress bar (shown when not yet wholesale) */}
                {!isWholesale && missingForWholesale < WHOLESALE_THRESHOLD && (
                  <div className="px-3 pb-2">
                    <div className="w-full bg-gray-100 rounded-full h-1">
                      <div
                        className="bg-brand-600 h-1 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(
                            (item.quantity / WHOLESALE_THRESHOLD) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Faltan {missingForWholesale} para precio mayorista (
                      S/ {item.wholesalePrice.toFixed(2)})
                    </p>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer: totals + checkout */}
      {cartItems.length > 0 && (
        <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50/80 to-white px-5 py-4 space-y-3">
          {/* Item count + wholesale summary */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {itemCount} {itemCount === 1 ? "unidad" : "unidades"}
            </span>
            {wholesaleItems.length > 0 && (
              <span className="text-green-600 font-medium">
                {wholesaleItems.length} en precio mayorista
              </span>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Total a pagar
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold tabular-nums text-brand-700">
                S/ {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <Button
            onClick={onCheckout}
            disabled={isCheckingOut || cartItems.length === 0}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed gap-2 h-11 text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
            aria-label="Cobrar"
          >
            {isCheckingOut ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Receipt size={16} />
                Cobrar
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
