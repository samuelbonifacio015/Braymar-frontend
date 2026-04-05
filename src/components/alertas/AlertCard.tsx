"use client"

import type { Alert, AlertSeverity } from "@/types/alerts"
import { AlertCircle, AlertTriangle, Info, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AlertCardProps {
  alert: Alert
  onResolve?: (id: string) => void
}

const severityConfig: Record<
  AlertSeverity,
  { icon: React.ElementType; baseClass: string; borderColor: string; titleColor: string }
> = {
  urgente: {
    icon: AlertCircle,
    baseClass: "border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20 dark:border-l-red-400",
    borderColor: "text-red-500",
    titleColor: "text-red-700 dark:text-red-400",
  },
  advertencia: {
    icon: AlertTriangle,
    baseClass: "border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20 dark:border-l-amber-400",
    borderColor: "text-amber-500",
    titleColor: "text-amber-700 dark:text-amber-400",
  },
  informativo: {
    icon: Info,
    baseClass: "border-l-4 border-l-sky-500 bg-sky-50/50 dark:bg-sky-950/20 dark:border-l-sky-400",
    borderColor: "text-sky-500",
    titleColor: "text-sky-700 dark:text-sky-400",
  },
}

const severityLabel: Record<AlertSeverity, string> = {
  urgente: "Urgente",
  advertencia: "Advertencia",
  informativo: "Informativo",
}

export function AlertCard({ alert, onResolve }: AlertCardProps) {
  const config = severityConfig[alert.severity]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "rounded-lg border shadow-sm p-4 flex flex-col gap-3 transition-colors",
        config.baseClass,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Icon size={20} className={cn("shrink-0 mt-0.5", config.borderColor)} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-sm font-semibold", config.titleColor)}>
                {severityLabel[alert.severity]}
              </span>
              {alert.resolvedAt && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle size={10} /> Resuelta
                </span>
              )}
            </div>
            <p className="text-sm text-foreground leading-snug">{alert.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(alert.createdAt).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Acciones rapidas */}
      {(alert.type === "out_of_stock" || alert.type === "low_stock") && (
        <div className="flex items-center gap-2 ml-8">
          <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
            <Link href="/inventario">
              <ArrowRight size={12} />
              Ver en inventario
            </Link>
          </Button>
          {onResolve && !alert.resolvedAt && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => onResolve(alert.id)}
            >
              <CheckCircle size={12} />
              Marcar como resuelta
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
