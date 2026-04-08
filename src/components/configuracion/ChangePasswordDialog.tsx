"use client"

import { useState } from "react"
import { Key, Eye, EyeOff, Save } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [form, setForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  })
  const [error, setError] = useState("")

  const handleSave = () => {
    setError("")

    if (!form.current || !form.newPassword || !form.confirm) {
      setError("Todos los campos son obligatorios")
      return
    }

    if (form.newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres")
      return
    }

    if (form.newPassword !== form.confirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    // TODO: conectar con API / Supabase
    showToast("Contraseña actualizada", "success")
    setForm({ current: "", newPassword: "", confirm: "" })
    onOpenChange(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setForm({ current: "", newPassword: "", confirm: "" })
      setError("")
    }
    onOpenChange(isOpen)
  }

  const fields: { key: keyof typeof form; label: string; placeholder: string }[] = [
    { key: "current", label: "Contraseña actual", placeholder: "Tu contraseña actual" },
    { key: "newPassword", label: "Nueva contraseña", placeholder: "Mínimo 8 caracteres" },
    { key: "confirm", label: "Confirmar nueva contraseña", placeholder: "Repite la nueva contraseña" },
  ]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key size={18} className="text-brand-600" />
            Cambiar Contraseña
          </DialogTitle>
          <DialogDescription>
            Actualiza tu contraseña de acceso al sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {field.label}
              </label>
              <div className="relative">
                <Input
                  type={showPasswords[field.key] ? "text" : "password"}
                  value={form[field.key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  className="rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      [field.key]: !prev[field.key],
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPasswords[field.key] ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPasswords[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}

          {/* Requisitos de contraseña */}
          <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Requisitos:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li className={form.newPassword.length >= 8 ? "text-emerald-600 font-medium" : ""}>
                • Mínimo 8 caracteres
              </li>
              <li className={form.newPassword && form.confirm && form.newPassword === form.confirm ? "text-emerald-600 font-medium" : ""}>
                • Ambas contraseñas coinciden
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            className="rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-brand-600 hover:bg-brand-700 rounded-lg"
          >
            <Save size={14} className="mr-1.5" />
            Actualizar contraseña
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
