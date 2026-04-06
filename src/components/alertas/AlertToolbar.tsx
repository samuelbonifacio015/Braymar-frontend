import { CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AlertSeverity } from "@/types/alerts"

interface TabDefinition {
  value: AlertSeverity | "todas"
  label: string
}

const TABS: TabDefinition[] = [
  { value: "todas", label: "Todas" },
  { value: "urgente", label: "Urgentes" },
  { value: "advertencia", label: "Advertencias" },
  { value: "informativo", label: "Informativas" },
]

interface AlertToolbarProps {
  activeTab: AlertSeverity | "todas"
  onTabChange: (tab: AlertSeverity | "todas") => void
  counts: Record<AlertSeverity | "todas", number>
  filteredCount: number
  onMarkAllRead?: () => void
}

export function AlertToolbar({
  activeTab,
  onTabChange,
  counts,
  filteredCount,
  onMarkAllRead,
}: AlertToolbarProps) {
  return (
    <div className="bg-card rounded-xl border border-border/40 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        {/* Segmented tabs */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/30">
          {TABS.map((tab) => {
            const count = counts[tab.value]
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 h-9 text-xs font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "ml-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums",
                    isActive
                      ? "bg-brand-100 text-brand-700"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Acción global */}
        {onMarkAllRead && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={onMarkAllRead}
          >
            <CheckCheck size={14} />
            Marcar todas leídas
          </Button>
        )}
      </div>

      <div className="px-4 py-3">
        <span className="text-xs text-muted-foreground font-medium">
          {filteredCount} alerta{filteredCount !== 1 ? "s" : ""} activa
          {filteredCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  )
}
