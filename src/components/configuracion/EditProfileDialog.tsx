"use client"

import { useState } from "react"
import { User, Save } from "lucide-react"

import type { ProfileInfo } from "@/types/settings"
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: ProfileInfo
  onSave: (profile: ProfileInfo) => void
}

export function EditProfileDialog({ open, onOpenChange, profile, onSave }: EditProfileDialogProps) {
  const [form, setForm] = useState(profile)
  const [error, setError] = useState("")

  // Sincronizar con prop cuando se abre el dialog
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setForm(profile)
      setError("")
    }
    onOpenChange(isOpen)
  }

  const handleSave = () => {
    setError("")

    if (!form.name.trim()) {
      setError("El nombre es obligatorio")
      return
    }

    if (!form.email.trim()) {
      setError("El email es obligatorio")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError("Por favor ingresa un email válido")
      return
    }

    onSave(form)
    showToast("Perfil actualizado correctamente", "success")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User size={18} className="text-brand-600" />
            Editar Perfil
          </DialogTitle>
          <DialogDescription>
            Modifica tu información personal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {form.avatarUrl && <AvatarImage src={form.avatarUrl} alt={form.name} />}
              <AvatarFallback className="bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 font-bold text-base">
                {form.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{form.name || "Sin nombre"}</p>
              <p className="text-xs text-gray-500">{form.email || "Sin email"}</p>
            </div>
          </div>

          {/* Campos */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nombre
              </label>
              <Input
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="rounded-lg"
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="rounded-lg"
                placeholder="tu@email.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                URL del avatar
              </label>
              <Input
                value={form.avatarUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))
                }
                className="rounded-lg"
                placeholder="https://..."
              />
              <p className="text-[11px] text-gray-400">URL de una imagen para tu foto de perfil</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rol
              </label>
              <Input
                value={form.role}
                disabled
                className="rounded-lg bg-gray-50 cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-400">El rol solo puede ser cambiado por un administrador</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
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
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
