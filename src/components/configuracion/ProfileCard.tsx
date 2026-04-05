"use client"

import { User, Edit } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function ProfileCard() {
  // TODO: obtener perfil desde autentificacion
  const user = {
    name: "Admin Braymar",
    email: "admin@braymar.com",
    role: "Administrador",
    avatarUrl: "",
  }

  return (
    <section className="bg-card rounded-xl border border-border/40 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <User size={17} className="text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Perfil de Usuario</h2>
            <p className="text-xs text-muted-foreground">Informacion de tu cuenta</p>
          </div>
        </div>

        <Button variant="outline" size="sm">
          <Edit size={14} className="mr-1.5" />
          Editar
        </Button>
      </div>

      <div className="px-5 py-5 flex flex-col sm:flex-row items-start gap-4">
        <Avatar size="lg">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
            {user.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
          <AvatarBadge />
        </Avatar>

        <div className="flex flex-col gap-0.5">
          <p className="text-base font-semibold text-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs font-medium text-primary mt-1">{user.role}</p>
        </div>
      </div>
    </section>
  )
}
