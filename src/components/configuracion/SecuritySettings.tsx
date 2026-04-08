"use client"

import { useState } from "react"
import { Shield, Key, Monitor, RotateCcw, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { showToast } from "@/components/ui/toast"
import { ChangePasswordDialog } from "./ChangePasswordDialog"
import { ResetConfigDialog } from "./ResetConfigDialog"

interface SecuritySettingsProps {
  onResetConfig: () => void
}

interface SessionInfo {
  id: string
  device: string
  location: string
  time: string
  current: boolean
}

const initialSessions: SessionInfo[] = [
  { id: "s1", device: "Chrome · Windows", location: "Lima, Perú", time: "Ahora", current: true },
  { id: "s2", device: "Safari · iPhone", location: "Lima, Perú", time: "Hace 2 hrs", current: false },
  { id: "s3", device: "Firefox · MacOS", location: "Miraflores, Lima", time: "Hace 1 día", current: false },
]

export function SecuritySettings({ onResetConfig }: SecuritySettingsProps) {
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [sessions, setSessions] = useState<SessionInfo[]>(initialSessions)

  const handleCloseSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    showToast("Sesión cerrada correctamente", "success")
  }

  const handleCloseAllSessions = () => {
    setSessions((prev) => prev.filter((s) => s.current))
    showToast("Todas las sesiones remotas han sido cerradas", "success")
  }

  const otherSessionsCount = sessions.filter((s) => !s.current).length

  return (
    <>
      <div className="space-y-4">
        {/* Cambiar contraseña */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Shield size={18} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Seguridad</h2>
                <p className="text-xs text-gray-500">Contraseña, sesiones y configuración</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Cambiar contraseña */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Key size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Contraseña</p>
                  <p className="text-xs text-gray-500">Última actualización hace 30 días</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPasswordOpen(true)}
                className="rounded-lg"
              >
                Cambiar
              </Button>
            </div>

            <div className="border-t border-gray-100" />

            {/* Sesiones activas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Monitor size={14} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sesiones activas ({sessions.length})
                  </p>
                </div>
                {otherSessionsCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseAllSessions}
                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} className="mr-1" />
                    Cerrar todas ({otherSessionsCount})
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {sessions.length === 0 ? (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center">
                    <p className="text-sm text-gray-500">No hay sesiones activas</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                          <Monitor size={14} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {session.device}
                            {session.current && (
                              <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">
                                Actual
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.location} · {session.time}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCloseSession(session.id)}
                          className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Cerrar
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Zona de peligro */}
        <section className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-red-50/50 to-white border-b border-red-100">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <RotateCcw size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-red-700">Zona de peligro</h2>
                <p className="text-xs text-red-500/70">Acciones irreversibles</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Restablecer configuración</p>
                <p className="text-xs text-gray-500">Volver a los valores por defecto del sistema</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResetOpen(true)}
                className="rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <RotateCcw size={14} className="mr-1.5" />
                Restablecer
              </Button>
            </div>
          </div>
        </section>
      </div>

      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
      <ResetConfigDialog open={resetOpen} onOpenChange={setResetOpen} onConfirm={onResetConfig} />
    </>
  )
}
