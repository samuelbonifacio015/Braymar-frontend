"use client"

import { useState, useMemo, useEffect } from "react"
import { ShoppingCart, Clock } from "lucide-react"
import { Topbar } from "@/components/layout/Topbar"
import { ProductSearch } from "@/components/ventas/ProductSearch"
import { CartItems } from "@/components/ventas/CartItems"
import { PaymentSelector } from "@/components/ventas/PaymentSelector"
import { SaleStats } from "@/components/ventas/SaleStats"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Product, Location } from "@/types/inventory"
import type { CartItem as CartItemType, PaymentMethod, Sale, SaleItem } from "@/types/sales"
import { getProducts } from "@/actions/inventory"
import { createSale, getSales, getSaleItems, getTodaySalesStats } from "@/actions/sales"


// Fallback location typed as Location
const DEFAULT_LOCATION: Location = "Almacén Tienda"

// Vista: "pos" para punto de venta, "history" para historial de ventas
type VentasView = "pos" | "history"

export default function VentasPage() {
  const [view, setView] = useState<VentasView>("pos")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItemType[]>([])
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  
  // State for sales from database
  const [completedSales, setCompletedSales] = useState<Sale[]>([])
  const [salesWithItems, setSalesWithItems] = useState<Map<string, SaleItem[]>>(new Map())
  const [loading, setLoading] = useState(false)
  
  // Stats state
  const [todayStats, setTodayStats] = useState({
    totalRevenue: 0,
    transactionCount: 0,
    averageTicket: 0,
  })

  const [products, setProducts] = useState<Product[]>([])

  // Fetch products on mount
  useEffect(() => {
    getProducts().then((p) => {
      setProducts(p)
    })
  }, [])

  // Fetch sales history when switching to history view
  useEffect(() => {
    if (view === "history") {
      setLoading(true)
      getSales().then(async (sales) => {
        setCompletedSales(sales)
        
        // Fetch items for each sale
        const itemsMap = new Map<string, SaleItem[]>()
        for (const sale of sales.slice(0, 20)) { // Limit to recent 20 sales for performance
          const items = await getSaleItems(sale.id)
          itemsMap.set(sale.id, items)
        }
        setSalesWithItems(itemsMap)
        setLoading(false)
      })
    }
  }, [view])

  // Fetch today's stats when in POS view
  useEffect(() => {
    if (view === "pos") {
      getTodaySalesStats().then(setTodayStats)
    }
  }, [view])


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

  // Confirmar pago y guardar en base de datos
  const handlePaymentConfirm = async (method: PaymentMethod) => {
    setIsCheckingOut(true)
    
    const saleItems: SaleItem[] = cart.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.quantity >= 10 ? item.wholesalePrice : item.unitPrice,
      total: (item.quantity >= 10 ? item.wholesalePrice : item.unitPrice) * item.quantity,
    }))

    const result = await createSale({
      items: saleItems,
      total,
      paymentMethod: method,
      saleBy: "vendedor",
    })

    if (result.success) {
      // Create local sale object for immediate UI update
      const sale: Sale = {
        id: result.saleId!,
        total,
        itemCount: cart.length,
        paymentMethod: method,
        saleBy: "vendedor",
        createdAt: new Date().toISOString(),
      }
      
      // Add to local state for immediate feedback
      setCompletedSales((prev) => [sale, ...prev])
      setSalesWithItems((prev) => new Map(prev).set(sale.id, saleItems))
      
      // Clear cart and close payment dialog
      setCart([])
      setPaymentOpen(false)
      
      // Refresh stats
      getTodaySalesStats().then(setTodayStats)
      
      // Refresh products to get updated stock
      getProducts().then((p) => setProducts(p))
    } else {
      // TODO: Show error toast to user
      console.error("Error creating sale:", result.error)
      alert(`Error al crear la venta: ${result.error}`)
    }
    
    setIsCheckingOut(false)
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
        {view === "pos" && (
          <SaleStats 
            sales={completedSales} 
            totalRevenue={todayStats.totalRevenue}
            transactionCount={todayStats.transactionCount}
            averageTicket={todayStats.averageTicket}
          />
        )}

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
            {loading ? (
              <div className="text-center py-16 text-gray-500">
                <p>Cargando ventas...</p>
              </div>
            ) : filteredSalesHistory.length > 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Productos</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Metodo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSalesHistory.map((sale) => {
                      const items = salesWithItems.get(sale.id) ?? []
                      return (
                        <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(sale.createdAt).toLocaleString("es-PE", {
                              day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {items.length > 0 
                              ? items.map((i) => `${i.productName} x${i.quantity}`).join(", ")
                              : `${sale.itemCount ?? 0} items`
                            }
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600">
                            {sale.itemCount ?? items.length}
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
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
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
