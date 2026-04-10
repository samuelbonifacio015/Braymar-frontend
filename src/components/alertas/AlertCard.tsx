"use client"

import type { Alert, AlertSeverity } from "@/types/alerts"
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  ArrowRight,
  Package,
  Truck,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AlertCardProps {
  alert: Alert
  index?: number
  onResolve?: (id: string) => void
}

// Configuración visual por severidad
const severityConfig: Record<
  AlertSeverity,
  {
    icon: React.ElementType
    borderColor: string
    badgeBg: string
    badgeText: string
    badgeBorder: string
    iconColor: string
    label: string
  }
> = {
  urgente: {
    icon: AlertCircle,
    borderColor: "border-l-red-500",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    badgeBorder: "border-red-200",
    iconColor: "text-red-500",
    label: "Urgente",
  },
  advertencia: {
    icon: AlertTriangle,
    borderColor: "border-amber-500",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200",
    iconColor: "text-amber-500",
    label: "Advertencia",
  },
  informativo: {
    icon: Info,
    borderColor: "border-l-sky-500",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
    badgeBorder: "border-sky-200",
    iconColor: "text-sky-500",
    label: "Informativo",
  },
}

// Determinar link y icono de acción según tipo de alerta
function getActionConfig(type: Alert["type"]) {
  switch (type) {
    case "out_of_stock":
    case "low_stock":
      return { href: "/inventario", label: "Ver en inventario", icon: Package }
    case "inactive_provider":
      return { href: "/proveedores", label: "Ver proveedor", icon: Truck }
    case "uncategorized":
      return { href: "/categorias", label: "Asignar categoría", icon: Tag }
    default:
      return { href: "/inventario", label: "Ver detalle", icon: ArrowRight }
  }
}

export function AlertCard({ alert, index = 0, onResolve }: AlertCardProps) {
  const config = severityConfig[alert.severity]
  const action = getActionConfig(alert.type)
  const Icon = config.icon
  const ActionIcon = action.icon

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border/40 border-l-[3px] shadow-sm p-5",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]",
        config.borderColor,
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        animation: "fadeSlideIn 0.3s ease-out both",
      }}
    >
      {/* Fila superior: icono + badge + timestamp */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              config.badgeBg,
            )}
          >
            <Icon size={16} className={config.iconColor} />
          </div>
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
              config.badgeBg,
              config.badgeText,
              config.badgeBorder,
            )}
          >
            {config.label}
          </span>
          {alert.resolvedAt && (
            <span className="inline-flex items-center gap-1 text-[11px] text-green-600 font-medium">
              <CheckCircle size={12} />
              Resuelta
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
          {new Date(alert.createdAt).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Mensaje */}
      <p className="text-sm text-foreground leading-relaxed mb-4 pl-[42px]">
        {alert.message}
      </p>

      {/* Acciones */}
      <div className="flex items-center gap-2 pl-[42px]">
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-brand-600 hover:bg-muted transition-colors"
        >
          <ActionIcon size={14} />
          {action.label}
        </Link>

        {onResolve && !alert.resolvedAt && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 text-xs hover:bg-green-50 hover:text-green-700 hover:border-green-200 cursor-pointer"
            onClick={() => onResolve(alert.id)}
          >
            <CheckCircle size={14} />
            Resolver
          </Button>
        )}
      </div>
    </div>
  )
}
