"use client"

import { useState, useMemo } from "react"
import { ShoppingCart, Clock } from "lucide-react"
import { Topbar } from "@/components/layout/Topbar"
import { ProductSearch } from "@/components/ventas/ProductSearch"
import { CartItems } from "@/components/ventas/CartItems"
import { PaymentSelector } from "@/components/ventas/PaymentSelector"
import { SaleStats } from "@/components/ventas/SaleStats"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Product, Location } from "@/types/inventory"
import type { CartItem as CartItemType, PaymentMethod, Sale } from "@/types/sales"

import { mockMovements } from "@/data/mock-movements"

// Fallback location typed as Location
const DEFAULT_LOCATION: Location = "Almacén Tienda"

// Vista: "pos" para punto de venta, "history" para historial de ventas
type VentasView = "pos" | "history"

export default function VentasPage() {
  const [view, setView] = useState<VentasView>("pos")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItemType[]>([])
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [completedSales, setCompletedSales] = useState<Sale[]>([])

  // Obtener productos desde los movimientos mock (usamos datos de referencia)
  // En produccion se usaria useProducts().Aqui creamos productos base para el POS.
  const products: Product[] = useMemo(
    () =>
      Array.from(
        new Map(
          mockMovements.map((m) => [
            m.productId,
            {
              id: m.productId,
              sku: m.sku,
              name: m.productName,
              stock: 100,
              stockStatus: "optimo" as const,
              location: m.toLocation ?? m.fromLocation ?? DEFAULT_LOCATION,
              unitPrice: parseFloat((Math.random() * 20 + 5).toFixed(2)),
              wholesalePrice: parseFloat((Math.random() * 15 + 3).toFixed(2)),
              category: "General",
              categoryId: "",
            },
          ]),
        ).values(),
      ),
    [],
  )

  // Agregar producto al carrito
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
            : item,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          unitPrice: product.unitPrice,
          wholesalePrice: product.wholesalePrice,
          quantity: 1,
          priceType: "unit" as const,
          stock: product.stock,
        },
      ]
    })
  }

  // Actualizar cantidad de un item
  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    )
  }

  // Eliminar item del carrito
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  // Vaciar carrito
  const clearCart = () => setCart([])

  // Calcular total: si cantidad >= 10 usar precio mayorista
  const total = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const price = item.quantity >= 10 ? item.wholesalePrice : item.unitPrice
        return sum + price * item.quantity
      }, 0),
    [cart],
  )

  // Confirmar pago
  const handlePaymentConfirm = (method: PaymentMethod) => {
    const sale: Sale = {
      id: `sale-${Date.now()}`,
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.quantity >= 10 ? item.wholesalePrice : item.unitPrice,
        total: (item.quantity >= 10 ? item.wholesalePrice : item.unitPrice) * item.quantity,
      })),
      total,
      paymentMethod: method,
      saleBy: "vendedor",
      createdAt: new Date().toISOString(),
    }
    setCompletedSales((prev) => [sale, ...prev])
    setCart([])
    setPaymentOpen(false)
  }

  // Filtrar ventas del historial
  const filteredSalesHistory = useMemo(() => {
    return [...completedSales]
  }, [completedSales])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar title="Ventas" searchQuery={searchTerm} onSearchChange={setSearchTerm} />

      <main className="flex-1 p-6 space-y-6">
        {/* Sub-toolbar: tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("pos")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              view === "pos" ? "bg-brand-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
            )}
          >
            <ShoppingCart size={14} className="inline mr-1.5 -mt-0.5" />
            Punto de Venta
          </button>
          <button
            onClick={() => setView("history")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              view === "history" ? "bg-brand-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
            )}
          >
            <Clock size={14} className="inline mr-1.5 -mt-0.5" />
            Historial
          </button>
        </div>

        {/* Estadisticas de ventas del dia */}
        {view === "pos" && <SaleStats sales={completedSales} />}

        {/* Vista POS */}
        {view === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-240px)] min-h-[500px]">
            { /* Columna izquierda: Busqueda de productos (3/5) */}
            <div className="lg:col-span-3 overflow-y-auto pr-1">
              <ProductSearch
                products={products}
                onAddToCart={addToCart}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            { /* Columna derecha: Carrito (2/5) */}
            <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col">
              <CartItems
                cartItems={cart}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onClear={clearCart}
                total={total}
                onCheckout={() => setPaymentOpen(true)}
                isCheckingOut={false}
              />
            </div>
          </div>
        )}

        {/* Vista Historial */}
        {view === "history" && (
          <div className="space-y-4">
            {filteredSalesHistory.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Productos</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Metodo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSalesHistory.map((sale) => (
                      <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(sale.createdAt).toLocaleString("es-PE", {
                            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {sale.items.map((i) => `${i.productName} x${i.quantity}`).join(", ")}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-right text-gray-900">
                          S/ {sale.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={cn(
                            "text-xs",
                            sale.paymentMethod === "efectivo" && "bg-green-100 text-green-700",
                            sale.paymentMethod === "yape_plin" && "bg-blue-100 text-blue-700",
                            sale.paymentMethod === "tarjeta" && "bg-purple-100 text-purple-700",
                          )}>
                            {sale.paymentMethod === "efectivo" ? "Efectivo" : sale.paymentMethod === "yape_plin" ? "Yape/Plin" : "Tarjeta"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {filteredSalesHistory.length === 0 && (
              <div className="text-center py-16 text-gray-500 rounded-lg border border-dashed border-gray-300 bg-white">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay ventas registradas aun.</p>
                <p className="text-xs mt-1">Vuelva al punto de venta para registrar una.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Dialog de pago */}
      <PaymentSelector
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        total={total}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  )
}
