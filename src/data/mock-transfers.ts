import type { Transfer } from "@/types/transfers"

export const mockTransfers: Transfer[] = [
  { id: "tf-1", productId: "prod-1", productName: "Cuaderno Espiral A4 - 100hj", sku: "BK-10293", origin: "Almacén Tienda", destination: "Cangallo", quantity: 50, requestedBy: "almacenero", status: "completed", createdAt: "2026-04-04T14:00:00" },
  { id: "tf-2", productId: "prod-3", productName: "Mochila Escolar Urbana", sku: "BC-55231", origin: "Santa Anita", destination: "Almacén Tienda", quantity: 10, requestedBy: "almacenero", status: "pending", createdAt: "2026-04-05T09:00:00" },
  { id: "tf-3", productId: "prod-6", productName: "Papel Crepe Surtido (Paquete x10)", sku: "PC-88990", origin: "Cochera", destination: "Santa Anita", quantity: 30, requestedBy: "almacenero", notes: "Reabastecer tienda", status: "completed", createdAt: "2026-04-03T16:45:00" },
  { id: "tf-4", productId: "prod-2", productName: "Lapiceros Azul (Caja x50)", sku: "PN-99201", origin: "Cochera", destination: "Almacén Tienda", quantity: 20, requestedBy: "almacenero", status: "completed", createdAt: "2026-03-29T10:15:00" },
  { id: "tf-5", productId: "prod-4", productName: "Borrador Blanco (Caja x20)", sku: "ER-12003", origin: "Cangallo", destination: "Santa Anita", quantity: 15, requestedBy: "almacenero", notes: "Pedido urgente", status: "cancelled", createdAt: "2026-03-28T12:00:00" },
  { id: "tf-6", productId: "prod-7", productName: "Lienzo 30x40cm", sku: "LZ-30400", origin: "Santa Anita", destination: "Cangallo", quantity: 8, requestedBy: "almacenero", status: "pending", createdAt: "2026-04-05T10:30:00" },
]

let localTransfers = [...mockTransfers]

export const getTransfers = (): Transfer[] => {
  return [...localTransfers]
}

export const addTransfer = (transfer: Omit<Transfer, "id">): Transfer => {
  const entry = { ...transfer, id: `tf-${Date.now()}` }
  localTransfers.unshift(entry)
  return entry
}

export const updateTransferStatus = (id: string, status: Transfer["status"]): void => {
  localTransfers = localTransfers.map(t =>
    t.id === id ? { ...t, status } : t
  )
}
