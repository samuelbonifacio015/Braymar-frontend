"use client"

import { useState } from "react"
import { Pencil, Save, X, Building2, MapPin, Phone, CreditCard, Hash } from "lucide-react"

import type { StoreSettings } from "@/types/settings"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StoreSettingsCardProps {
  store: StoreSettings
  onUpdate: (store: StoreSettings) => void
}

export function StoreSettingsCard({ store, onUpdate }: StoreSettingsCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState(store)

  const handleCancel = () => {
    setForm(store)
    setIsEditing(false)
  }

  const handleSave = () => {
    onUpdate(form)
    setIsEditing(false)
  }

  const startEditing = () => {
    setForm(store)
    setIsEditing(true)
  }

  const fields: { label: string; key: keyof StoreSettings; disabled: boolean; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { label: "Nombre de la tienda", key: "storeName", disabled: false, icon: Building2 },
    { label: "RUC", key: "ruc", disabled: true, icon: Hash },
    { label: "Dirección", key: "address", disabled: false, icon: MapPin },
    { label: "Teléfono", key: "phone", disabled: false, icon: Phone },
  ]

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header con gradiente sutil */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Building2 size={18} className="text-brand-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Información de la Tienda</h2>
            <p className="text-xs text-gray-500">Datos generales de tu negocio</p>
          </div>
        </div>

        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={startEditing}
            className="rounded-lg"
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
              className="text-gray-500"
            >
              <X size={14} className="mr-1" />
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-brand-600 hover:bg-brand-700 rounded-lg"
            >
              <Save size={14} className="mr-1" />
              Guardar
            </Button>
          </div>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fields.map((field) => {
          const Icon = field.icon
          return (
            <div key={field.key} className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <Icon size={12} className="text-gray-400" />
                {field.label}
              </label>
              <Input
                value={form[field.key]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                disabled={!isEditing || field.disabled}
                className={cn(
                  "rounded-lg border-gray-200 transition-all",
                  !isEditing && "bg-gray-50 cursor-default",
                  isEditing && !field.disabled && "border-brand-200 focus:border-brand-400",
                  field.disabled && isEditing && "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              />
              {field.disabled && isEditing && (
                <p className="text-[11px] text-gray-400">Este campo no se puede editar</p>
              )}
            </div>
          )
        })}

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <CreditCard size={12} className="text-gray-400" />
            Moneda
          </label>
          <Input
            value="S/ (PEN)"
            disabled
            className="rounded-lg bg-gray-50 cursor-default border-gray-200"
          />
          <p className="text-[11px] text-gray-400">Moneda fija del sistema</p>
        </div>
      </div>
    </section>
  )
}
