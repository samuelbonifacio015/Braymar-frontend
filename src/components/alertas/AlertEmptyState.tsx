import { CheckCircle2, Package, Bell } from "lucide-react"
import Link from "next/link"
import type { AlertSeverity } from "@/types/alerts"

interface AlertEmptyStateProps {
  activeTab: AlertSeverity | "todas"
}

const tabMessages: Record<
  AlertSeverity | "todas",
  { title: string; description: string }
> = {
  todas: {
    title: "Sin alertas activas",
    description:
      "El sistema está funcionando correctamente. No hay situaciones que requieran atención.",
  },
  urgente: {
    title: "No hay alertas urgentes",
    description:
      "No se detectaron productos agotados ni problemas críticos en el inventario.",
  },
  advertencia: {
    title: "No hay advertencias",
    description:
      "Todos los productos están en niveles óptimos de stock y los proveedores están activos.",
  },
  informativo: {
    title: "No hay alertas informativas",
    description:
      "Todos los productos están correctamente categorizados y organizados.",
  },
}

export function AlertEmptyState({ activeTab }: AlertEmptyStateProps) {
  const content = tabMessages[activeTab]

  return (
    <div className="bg-card rounded-xl border border-border/40 shadow-sm py-16 px-6 flex flex-col items-center text-center">
      {/* Icono principal */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        {/* Halo decorativo */}
        <div className="absolute -inset-2 rounded-2xl bg-green-100/30 -z-10" />
      </div>

      {/* Texto */}
      <h3 className="text-base font-semibold text-foreground mb-1.5">
        {content.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
        {content.description}
      </p>

      {/* CTA al inventario */}
      <div className="flex items-center gap-2">
        <Link
          href="/inventario"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted hover:text-foreground transition-colors"
        >
          <Package size={14} />
          Ir al inventario
        </Link>
        {activeTab !== "todas" && (
          <Link
            href="/alertas"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Bell size={14} />
            Ver todas las alertas
          </Link>
        )}
      </div>
    </div>
  )
}
