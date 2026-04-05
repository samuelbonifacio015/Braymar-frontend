"use client"

import { useState } from "react"
import { useProducts } from "@/hooks/use-products"
import { getTransfers, addTransfer, updateTransferStatus } from "@/data/mock-transfers"
import type { Transfer } from "@/types/transfers"
import { Topbar } from "@/components/layout/Topbar"
import { TransferStats } from "@/components/transferencias/TransferStats"
import { TransferForm } from "@/components/transferencias/TransferForm"
import { TransferHistory } from "@/components/transferencias/TransferHistory"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TransferenciasPage() {
  const { products, loading: productsLoading } = useProducts()
  const [transfers, setTransfers] = useState<Transfer[]>(() => getTransfers())
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleCreateTransfer = (data: {
    productId: string
    origin: Exclude<Transfer["origin"], undefined>
    destination: Exclude<Transfer["destination"], undefined>
    quantity: number
    notes?: string
  }) => {
    const product = products.find((p) => p.id === data.productId)
    if (!product) return

    const newTransfer = addTransfer({
      productId: data.productId,
      productName: product.name,
      sku: product.sku,
      origin: data.origin,
      destination: data.destination,
      quantity: data.quantity,
      requestedBy: "almacenero",
      notes: data.notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    })

    setTransfers(getTransfers())
  }

  const handleCompleteTransfer = (id: string) => {
    updateTransferStatus(id, "completed")
    setTransfers(getTransfers())
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background">
      <Topbar title="Gestión de Transferencias" searchQuery="" onSearchChange={() => {}} />

      <main className="flex-1 p-6 space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-semibold tracking-tight">Transferencias</h1>
            <p className="text-sm text-muted-foreground mt-1">Administra las transferencias de stock entre almacenes</p>
          </div>
          <Button
            className="bg-brand-600 hover:bg-brand-700 text-white gap-2 h-9 px-4 text-sm"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus size={16} />
            Nueva Transferencia
          </Button>
        </div>

        {/* Estadisticas */}
        {!productsLoading && <TransferStats transfers={transfers} />}

        {/* Historial */}
        <TransferHistory transfers={transfers} onCompleteTransfer={handleCompleteTransfer} />

        {/* Formulario de creacion */}
        <TransferForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          products={products}
          onSubmit={handleCreateTransfer}
        />
      </main>
    </div>
  )
}
