"use client"

import { useState, useEffect } from "react"
import { useProducts } from "@/hooks/use-products"
import { supabase } from "@/lib/supabase/client"
import type { Transfer } from "@/types/transfers"
import { Topbar } from "@/components/layout/Topbar"
import { TransferStats } from "@/components/transferencias/TransferStats"
import { TransferForm } from "@/components/transferencias/TransferForm"
import { TransferHistory } from "@/components/transferencias/TransferHistory"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TransferenciasPage() {
  const { products, loading: productsLoading } = useProducts()
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchTransfers = async () => {
    const { data } = await supabase.from('transfers').select('*').order('created_at', { ascending: false })
    if (data) {
      setTransfers(data.map(t => ({
        id: t.id,
        productId: t.product_id,
        productName: t.product_name,
        sku: t.sku,
        origin: t.origin,
        destination: t.destination,
        quantity: t.quantity,
        requestedBy: t.requested_by,
        notes: t.notes,
        status: t.status,
        createdAt: t.created_at
      } as Transfer)))
    }
  }

  useEffect(() => {
    fetchTransfers()
  }, [])

  const handleCreateTransfer = async (data: {
    productId: string
    origin: Exclude<Transfer["origin"], undefined>
    destination: Exclude<Transfer["destination"], undefined>
    quantity: number
    notes?: string
  }) => {
    const product = products.find((p) => p.id === data.productId)
    if (!product) return

    await supabase.from('transfers').insert({
      id: `tf-${Date.now()}`,
      product_id: data.productId,
      product_name: product.name,
      sku: product.sku,
      origin: data.origin,
      destination: data.destination,
      quantity: data.quantity,
      requested_by: "almacenero",
      notes: data.notes,
      status: "pending"
    })

    fetchTransfers()
  }

  const handleCompleteTransfer = async (id: string) => {
    await supabase.from('transfers').update({ status: 'completed' }).eq('id', id)
    fetchTransfers()
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
