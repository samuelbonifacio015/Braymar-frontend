import { Product } from "@/types/inventory"

export const getProducts = (): Product[] => {
  return [
    {
      id: "prod-1",
      sku: "BK-10293",
      name: "Cuaderno Espiral A4 - 100hj",
      stock: 540,
      stockStatus: "optimo",
      location: "Almacén Tienda",
      unitPrice: 12.50,
      wholesalePrice: 11.00,
      category: "Cuadernos",
      imageUrl: "/placeholder.png"
    },
    {
      id: "prod-2",
      sku: "PN-99201",
      name: "Lapiceros Azul (Caja x50)",
      stock: 12,
      stockStatus: "bajo_stock",
      location: "Cochera",
      unitPrice: 45.00,
      wholesalePrice: 40.00,
      category: "Escritura",
      imageUrl: "/placeholder.png"
    },
    {
      id: "prod-3",
      sku: "BC-55231",
      name: "Mochila Escolar Urbana",
      stock: 0,
      stockStatus: "agotado",
      location: "Santa Anita",
      unitPrice: 89.90,
      wholesalePrice: 75.00,
      category: "Mochilas",
      imageUrl: "/placeholder.png"
    },
    {
      id: "prod-4",
      sku: "ER-12003",
      name: "Borrador Blanco (Caja x20)",
      stock: 120,
      stockStatus: "optimo",
      location: "Cangallo",
      unitPrice: 18.20,
      wholesalePrice: 15.00,
      category: "Útiles de Escritorio",
      imageUrl: "/placeholder.png"
    },
    {
      id: "prod-5",
      sku: "GL-44021",
      name: "Silicona Líquida 250ml",
      stock: 18,
      stockStatus: "bajo_stock",
      location: "Almacén Tienda",
      unitPrice: 5.50,
      wholesalePrice: 4.80,
      category: "Manualidades",
      imageUrl: "/placeholder.png"
    },
    {
      id: "prod-6",
      sku: "PC-88990",
      name: "Papel Crepe Surtido (Paquete x10)",
      stock: 250,
      stockStatus: "optimo",
      location: "Cochera",
      unitPrice: 10.00,
      wholesalePrice: 8.50,
      category: "Manualidades",
      imageUrl: "/placeholder.png"
    },
    {
      id: "prod-7",
      sku: "LZ-30400",
      name: "Lienzo 30x40cm",
      stock: 45,
      stockStatus: "optimo",
      location: "Santa Anita",
      unitPrice: 15.00,
      wholesalePrice: 12.00,
      category: "Arte",
      imageUrl: "/placeholder.png"
    },
    {
      id: "prod-8",
      sku: "AN-A4200",
      name: "Anillado A4 (Paquete x100)",
      stock: 5,
      stockStatus: "bajo_stock",
      location: "Cangallo",
      unitPrice: 35.00,
      wholesalePrice: 30.00,
      category: "Oficina",
      imageUrl: "/placeholder.png"
    }
  ]
}
