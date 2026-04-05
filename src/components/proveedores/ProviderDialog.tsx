"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Provider, ProviderStatus, ReliabilityLevel } from "@/types/providers"

const AVATAR_COLORS = ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed", "#e11d48", "#0891b2", "#475569", "#ea580c", "#6d28d9"]

interface ProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider: Provider | null
  onSave: (data: Provider) => void
}

const EMPTY_PROVIDER = {
  ruc: "",
  name: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  status: "activo" as ProviderStatus,
  reliability: "bueno" as ReliabilityLevel,
  reliabilityScore: 3,
  onTimeRate: 80,
  deliveryDays: 5,
  productIds: [],
  notes: "",
  since: new Date().toISOString(),
  avatarColor: AVATAR_COLORS[0],
}

export function ProviderDialog({ open, onOpenChange, provider, onSave }: ProviderDialogProps) {
  const isEditing = provider !== null
  const [form, setForm] = useState(EMPTY_PROVIDER)

  useEffect(() => {
    if (provider) {
      setForm(provider)
    } else {
      setForm({ ...EMPTY_PROVIDER, id: `prov-${Date.now()}` })
    }
  }, [provider, open])

  const set = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.ruc.trim()) return
    onSave({ ...form, id: form.id || `prov-${Date.now()}` })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modifica los datos del proveedor." : "Registra un nuevo proveedor para tu inventario."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Avatar color */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => set("avatarColor", color)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    form.avatarColor === color ? "ring-2 ring-offset-2 ring-brand-600 scale-110" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Nombre / Razon Social</label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej. Distribuidora San Isidro S.A.C." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">RUC</label>
              <Input value={form.ruc} onChange={(e) => set("ruc", e.target.value)} placeholder="20XXXXXXXXX" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Persona de Contacto</label>
              <Input value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} placeholder="Nombre completo" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Telefono</label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+51 999 888 777" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="correo@empresa.pe" type="email" />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Direccion</label>
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Av. Ejemplo 123, Lima" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Estado</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="en_revision">En Revision</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Confiabilidad</label>
              <select
                value={form.reliability}
                onChange={(e) => {
                  const scoreMap: Record<string, number> = { excelente: 5, muy_bueno: 4, bueno: 3, regular: 2, deficiente: 1 }
                  set("reliability", e.target.value)
                  set("reliabilityScore", scoreMap[e.target.value] ?? 3)
                }}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="excelente">Excelente</option>
                <option value="muy_bueno">Muy Bueno</option>
                <option value="bueno">Bueno</option>
                <option value="regular">Regular</option>
                <option value="deficiente">Deficiente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Puntualidad (%)</label>
              <Input type="number" value={form.onTimeRate} onChange={(e) => set("onTimeRate", parseInt(e.target.value) || 0)} min={0} max={100} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Dias de Entrega</label>
              <Input type="number" value={form.deliveryDays} onChange={(e) => set("deliveryDays", parseInt(e.target.value) || 1)} min={1} />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Notas</label>
            <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Observaciones sobre el proveedor" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={handleSave} disabled={!form.name.trim() || !form.ruc.trim()}>
            {isEditing ? "Guardar" : "Registrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}