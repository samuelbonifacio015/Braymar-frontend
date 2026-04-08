"use client"

import { Bell, Mail, Volume2, Package, ArrowLeftRight, TrendingUp } from "lucide-react"

import type { NotificationPreferences } from "@/types/settings"
import { Switch } from "@/components/ui/switch"
import { showToast } from "@/components/ui/toast"

interface NotificationSettingsProps {
  notifications: NotificationPreferences
  onUpdate: (notifications: NotificationPreferences) => void
}

interface ToggleItem {
  key: keyof NotificationPreferences
  label: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  iconBg: string
  iconColor: string
}

/** Play a subtle notification sound preview */
function playNotificationSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = "sine"
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  } catch {
    // AudioContext not available
  }
}

export function NotificationSettings({ notifications, onUpdate }: NotificationSettingsProps) {
  const toggleItems: ToggleItem[] = [
    {
      key: "lowStockAlerts",
      label: "Alertas de stock bajo",
      description: "Recibir alertas cuando un producto baje del umbral",
      icon: Package,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      key: "transferAlerts",
      label: "Alertas de transferencias",
      description: "Notificaciones al recibir o enviar transferencias",
      icon: ArrowLeftRight,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      key: "salesSummary",
      label: "Resumen de ventas diario",
      description: "Un resumen al final del día con las ventas realizadas",
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      key: "emailNotifications",
      label: "Notificaciones por email",
      description: "También enviar las alertas al correo registrado",
      icon: Mail,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      key: "soundEnabled",
      label: "Sonido de notificaciones",
      description: "Reproducir un sonido sutil al recibir alertas",
      icon: Volume2,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ]

  const handleToggle = (key: keyof NotificationPreferences, checked: boolean) => {
    onUpdate({ ...notifications, [key]: checked })

    // Play sound preview when enabling sounds
    if (key === "soundEnabled" && checked) {
      playNotificationSound()
    }

    // Show contextual feedback for email notifications
    if (key === "emailNotifications" && checked) {
      showToast("Las notificaciones se enviarán a tu correo registrado", "info")
    }
  }

  // Count how many alerts are active
  const activeCount = toggleItems.filter(
    (item) => notifications[item.key] as boolean
  ).length

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Bell size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Notificaciones</h2>
              <p className="text-xs text-gray-500">Controla qué alertas deseas recibir</p>
            </div>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {activeCount} de {toggleItems.length} activas
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-1">
          {toggleItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={item.key}>
                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                      <Icon size={16} className={item.iconColor} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[item.key] as boolean}
                    onCheckedChange={(checked: boolean) => handleToggle(item.key, checked)}
                  />
                </div>
                {idx < toggleItems.length - 1 && (
                  <div className="border-b border-gray-100" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
