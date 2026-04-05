"use client"

import { useState } from "react"
import { Pencil, Save, X, Building2 } from "lucide-react"

import { mockStoreSettings } from "@/data/mock-settings"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function StoreSettingsCard() {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    storeName: mockStoreSettings.storeName,
    ruc: mockStoreSettings.ruc,
    address: mockStoreSettings.address,
    phone: mockStoreSettings.phone,
  })

  const handleCancel = () => {
    setForm({
      storeName: mockStoreSettings.storeName,
      ruc: mockStoreSettings.ruc,
      address: mockStoreSettings.address,
      phone: mockStoreSettings.phone,
    })
    setIsEditing(false)
  }

  const handleSave = () => {
    // TODO: persistir cambios via API o Supabase
    setIsEditing(false)
  }

  const fields = [
    { label: "Nombre de la tienda", key: "storeName" as const, disabled: false },
    { label: "RUC", key: "ruc" as const, disabled: true },
    { label: "Direccion", key: "address" as const, disabled: false },
    { label: "Telefono", key: "phone" as const, disabled: false },
  ]

  return (
    <section className="bg-card rounded-xl border border-border/40 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <Building2 size={17} className="text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Informacion de la Tienda</h2>
            <p className="text-xs text-muted-foreground">Datos generales del negocio</p>
          </div>
        </div>

        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={14} className="mr-1.5" />
            Editar
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X size={14} className="mr-1" />
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
            >
              <Save size={14} className="mr-1" />
              Guardar
            </Button>
          </div>
        )}
      </div>

      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {field.label}
            </label>
            <Input
              value={form[field.key]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              disabled={!isEditing || field.disabled}
              className={cn(!isEditing && "cursor-default")}
            />
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Moneda
          </label>
          <Input
            value="S/ (PEN)"
            disabled
            className="cursor-default"
          />
        </div>
      </div>
    </section>
  )
}
