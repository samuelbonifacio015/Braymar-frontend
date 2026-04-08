"use client"

import { useState, useMemo, useCallback } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { ProviderHealthBar } from "@/components/proveedores/ProviderHealthBar"
import { ProviderCard } from "@/components/proveedores/ProviderCard"
import { ProviderDialog } from "@/components/proveedores/ProviderDialog"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useProviders } from "@/hooks/use-providers"
import { useProducts } from "@/hooks/use-products"
import { supabase } from "@/lib/supabase/client"
import type { Provider } from "@/types/providers"
import type { Product } from "@/types/inventory"

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "activo", label: "Activos" },
  { value: "inactivo", label: "Inactivos" },
  { value: "en_revision", label: "En Revision" },
]

export default function ProveedoresPage() {
  const { providers, loading: provLoading, refresh: refreshProviders, setProviders } = useProviders()
  const { products, loading: prodLoading } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)

  const filteredProviders = useMemo(() => {
    let result = providers
    if (statusFilter !== "todos") {
      result = result.filter((p) => p.status === statusFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.ruc.includes(q) ||
          p.contactPerson.toLowerCase().includes(q)
      )
    }
    return result
  }, [providers, statusFilter, searchQuery])

  const handleSave = useCallback(
    async (data: Provider) => {
      const providerData = {
        id: data.id || `prov-${Date.now()}`,
        ruc: data.ruc,
        name: data.name,
        contact_person: data.contactPerson,
        phone: data.phone,
        email: data.email,
        address: data.address,
        status: data.status,
        reliability: data.reliability,
        reliability_score: data.reliabilityScore,
        on_time_rate: data.onTimeRate,
        delivery_days: data.deliveryDays,
        product_ids: data.productIds,
        notes: data.notes,
        since: data.since || new Date().toISOString(),
        avatar_color: data.avatarColor
      };

      if (editingProvider) {
        await supabase.from("providers").update(providerData).eq("id", editingProvider.id)
      } else {
        await supabase.from("providers").insert(providerData)
      }
      setIsDialogOpen(false)
      setEditingProvider(null)
      await refreshProviders()
    },
    [editingProvider, refreshProviders]
  )

  const isLoading = provLoading || prodLoading

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar title="Proveedores" searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 p-6 space-y-6">
        {!isLoading && <ProviderHealthBar providers={providers} />}

        {/* Toolbar */}
        <div className="bg-card rounded-xl border border-border/40 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <Button
              className="bg-brand-600 hover:bg-brand-700 text-white gap-2 h-9 px-4 text-sm"
              onClick={() => { setEditingProvider(null); setIsDialogOpen(true) }}
              disabled={isLoading}
            >
              <Plus size={16} />
              Nuevo Proveedor
            </Button>

            <div className="flex items-center gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3 h-8 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === f.value
                      ? "bg-brand-600 text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-3">
            <span className="text-xs text-muted-foreground font-medium">
              {filteredProviders.length} proveedor{filteredProviders.length !== 1 ? "es" : ""}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm bg-card rounded-xl border">
            Cargando proveedores...
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm bg-card rounded-xl border">
            No se encontraron proveedores
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                products={products}
                onEdit={(p) => {
                  setEditingProvider(p)
                  setIsDialogOpen(true)
                }}
              />
            ))}
          </div>
        )}
      </main>

      <ProviderDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingProvider(null)
        }}
        provider={editingProvider}
        onSave={handleSave}
      />
    </div>
  )
}