import type { Product } from "@/types/inventory"
import type { Provider } from "@/types/providers"
import type { Alert } from "@/types/alerts"

/**
 * Genera alertas automaticamente a partir del estado de productos y proveedores.
 */
export function generateAlerts(
  products: Product[],
  providers: Provider[],
): Alert[] {
  const alerts: Alert[] = []

  // Verificar productos agotados
  products.forEach((product) => {
    if (product.stockStatus === "agotado") {
      alerts.push({
        id: `alert-agotado-${product.id}`,
        type: "out_of_stock",
        severity: "urgente",
        message: `El producto "${product.name}" (SKU: ${product.sku}) esta agotado. Se requiere reabastecimiento inmediato.`,
        productIds: [product.id],
        createdAt: new Date().toISOString().split("T")[0],
      })
    }
  })

  // Verificar stock bajo
  products.forEach((product) => {
    if (product.stockStatus === "bajo_stock") {
      alerts.push({
        id: `alert-stock-bajo-${product.id}`,
        type: "low_stock",
        severity: "advertencia",
        message: `El producto "${product.name}" (SKU: ${product.sku}) tiene stock bajo (${product.stock} unidades). Considere realizar un pedido.`,
        productIds: [product.id],
        createdAt: new Date().toISOString().split("T")[0],
      })
    }
  })

  // Verificar proveedores inactivos
  providers.forEach((provider) => {
    if (provider.status === "inactivo") {
      alerts.push({
        id: `alert-inactivo-${provider.id}`,
        type: "inactive_provider",
        severity: "advertencia",
        message: `El proveedor "${provider.name}" esta inactivo. Verifique si es posible reactivarlo o buscar alternativas.`,
        providerIds: [provider.id],
        createdAt: new Date().toISOString().split("T")[0],
      })
    }
  })

  // Verificar productos sin categoria
  products.forEach((product) => {
    if (!product.category || product.category.trim() === "") {
      alerts.push({
        id: `alert-uncategorized-${product.id}`,
        type: "uncategorized",
        severity: "informativo",
        message: `El producto "${product.name}" (SKU: ${product.sku}) no tiene categoria asignada. Clasifique para mejorar la organizacion.`,
        productIds: [product.id],
        createdAt: new Date().toISOString().split("T")[0],
      })
    }
  })

  return alerts
}
