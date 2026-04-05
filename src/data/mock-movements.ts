import type { StockMovement } from "@/types/movements"

export const mockMovements: StockMovement[] = [
  { id: "mov-1", productId: "prod-1", productName: "Cuaderno Espiral A4 - 100hj", sku: "BK-10293", type: "entrada", quantity: 200, toLocation: "Almacén Tienda", performedBy: "admin", createdAt: "2026-04-05T08:30:00", notes: "Reposicion semanal" },
  { id: "mov-2", productId: "prod-2", productName: "Lapiceros Azul (Caja x50)", sku: "PN-99201", type: "salida", quantity: 30, fromLocation: "Cochera", performedBy: "vendedor", createdAt: "2026-04-05T09:15:00", notes: "Venta mayorista" },
  { id: "mov-3", productId: "prod-1", productName: "Cuaderno Espiral A4 - 100hj", sku: "BK-10293", type: "transferencia", quantity: 50, fromLocation: "Almacén Tienda", toLocation: "Cangallo", performedBy: "almacenero", createdAt: "2026-04-04T14:00:00" },
  { id: "mov-4", productId: "prod-4", productName: "Borrador Blanco (Caja x20)", sku: "ER-12003", type: "entrada", quantity: 80, toLocation: "Cangallo", performedBy: "admin", createdAt: "2026-04-04T10:00:00", notes: "Compra al proveedor" },
  { id: "mov-5", productId: "prod-5", productName: "Silicona Líquida 250ml", sku: "GL-44021", type: "salida", quantity: 12, fromLocation: "Almacén Tienda", performedBy: "vendedor", createdAt: "2026-04-04T11:30:00" },
  { id: "mov-6", productId: "prod-6", productName: "Papel Crepe Surtido (Paquete x10)", sku: "PC-88990", type: "transferencia", quantity: 30, fromLocation: "Cochera", toLocation: "Santa Anita", performedBy: "almacenero", createdAt: "2026-04-03T16:45:00" },
  { id: "mov-7", productId: "prod-8", productName: "Anillado A4 (Paquete x100)", sku: "AN-A4200", type: "salida", quantity: 15, fromLocation: "Cangallo", performedBy: "vendedor", createdAt: "2026-04-03T09:00:00", notes: "Pedido oficina" },
  { id: "mov-8", productId: "prod-7", productName: "Lienzo 30x40cm", sku: "LZ-30400", type: "ajuste", quantity: -3, toLocation: "Santa Anita", performedBy: "admin", createdAt: "2026-04-02T17:00:00", notes: "Ajuste por inventario físico" },
  { id: "mov-9", productId: "prod-3", productName: "Mochila Escolar Urbana", sku: "BC-55231", type: "salida", quantity: 8, fromLocation: "Santa Anita", performedBy: "vendedor", createdAt: "2026-04-02T12:20:00" },
  { id: "mov-10", productId: "prod-2", productName: "Lapiceros Azul (Caja x50)", sku: "PN-99201", type: "entrada", quantity: 50, toLocation: "Cochera", performedBy: "admin", createdAt: "2026-04-01T08:00:00", notes: "Reposicion de proveedor" },
  { id: "mov-11", productId: "prod-4", productName: "Borrador Blanco (Caja x20)", sku: "ER-12003", type: "salida", quantity: 25, fromLocation: "Cangallo", performedBy: "vendedor", createdAt: "2026-04-01T13:15:00" },
  { id: "mov-12", productId: "prod-1", productName: "Cuaderno Espiral A4 - 100hj", sku: "BK-10293", type: "transferencia", quantity: 40, fromLocation: "Almacén Tienda", toLocation: "Santa Anita", performedBy: "almacenero", createdAt: "2026-03-31T11:00:00" },
  { id: "mov-13", productId: "prod-6", productName: "Papel Crepe Surtido (Paquete x10)", sku: "PC-88990", type: "entrada", quantity: 100, toLocation: "Cochera", performedBy: "admin", createdAt: "2026-03-31T09:30:00", notes: "Pedido a proveedor" },
  { id: "mov-14", productId: "prod-5", productName: "Silicona Líquida 250ml", sku: "GL-44021", type: "ajuste", quantity: -2, toLocation: "Almacén Tienda", performedBy: "admin", createdAt: "2026-03-30T17:00:00", notes: "Merma por producto dañado" },
  { id: "mov-15", productId: "prod-7", productName: "Lienzo 30x40cm", sku: "LZ-30400", type: "entrada", quantity: 20, toLocation: "Santa Anita", performedBy: "admin", createdAt: "2026-03-30T08:30:00" },
  { id: "mov-16", productId: "prod-8", productName: "Anillado A4 (Paquete x100)", sku: "AN-A4200", type: "salida", quantity: 20, fromLocation: "Cangallo", performedBy: "vendedor", createdAt: "2026-03-29T14:00:00" },
  { id: "mov-17", productId: "prod-2", productName: "Lapiceros Azul (Caja x50)", sku: "PN-99201", type: "transferencia", quantity: 20, fromLocation: "Cochera", toLocation: "Almacén Tienda", performedBy: "almacenero", createdAt: "2026-03-29T10:15:00" },
  { id: "mov-18", productId: "prod-3", productName: "Mochila Escolar Urbana", sku: "BC-55231", type: "salida", quantity: 5, fromLocation: "Santa Anita", performedBy: "vendedor", createdAt: "2026-03-28T16:00:00" },
  { id: "mov-19", productId: "prod-1", productName: "Cuaderno Espiral A4 - 100hj", sku: "BK-10293", type: "entrada", quantity: 500, toLocation: "Almacén Tienda", performedBy: "admin", createdAt: "2026-03-28T08:00:00", notes: "Compra inicio de temporada" },
  { id: "mov-20", productId: "prod-4", productName: "Borrador Blanco (Caja x20)", sku: "ER-12003", type: "ajuste", quantity: 5, toLocation: "Cangallo", performedBy: "admin", createdAt: "2026-03-27T17:00:00", notes: "Contaje adicional" },
]

let localMovements = [...mockMovements]

export const getMovements = (): StockMovement[] => {
  return [...localMovements]
}

export const addMovement = (movement: Omit<StockMovement, "id">): StockMovement => {
  const entry = { ...movement, id: `mov-${Date.now()}` }
  localMovements.unshift(entry)
  return entry
}
