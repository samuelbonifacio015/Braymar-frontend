"use client"

import { User } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { ProfileInfo } from "@/types/settings"
import { EditProfileDialog } from "./EditProfileDialog"
import { useState } from "react"

interface ProfileCardProps {
  profile: ProfileInfo
  onUpdate: (profile: ProfileInfo) => void
}

export function ProfileCard({ profile, onUpdate }: ProfileCardProps) {
  const [editOpen, setEditOpen] = useState(false)

  const roleColors: Record<string, string> = {
    Administrador: "bg-brand-50 text-brand-700 border-brand-200",
    Vendedor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Almacenero: "bg-violet-50 text-violet-700 border-violet-200",
    Gerencia: "bg-amber-50 text-amber-700 border-amber-200",
  }

  return (
    <>
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <User size={18} className="text-violet-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Perfil de Usuario</h2>
                <p className="text-xs text-gray-500">Información de tu cuenta</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="rounded-lg"
            >
              Editar perfil
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-5">
            <Avatar size="lg">
              {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
              <AvatarFallback className="bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 font-bold text-base">
                {profile.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
              <AvatarBadge />
            </Avatar>

            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-base font-bold text-gray-900">{profile.name}</p>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <span
                className={`inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-1 ${
                  roleColors[profile.role] || "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {profile.role}
              </span>
            </div>
          </div>

          {/* Estadísticas rápidas del perfil */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">24</p>
              <p className="text-[11px] text-gray-500">Días activo</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">156</p>
              <p className="text-[11px] text-gray-500">Acciones hoy</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-600">En línea</p>
              <p className="text-[11px] text-gray-500">Estado</p>
            </div>
          </div>
        </div>
      </section>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        onSave={onUpdate}
      />
    </>
  )
}
