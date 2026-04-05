"use client"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ReportPeriod } from "@/types/reports"
import { CalendarDays } from "lucide-react"

const PERIODS: { key: ReportPeriod; label: string }[] = [
  { key: "today", label: "Hoy" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
  { key: "custom", label: "Personalizado" },
]

interface ReportFiltersProps {
  period: ReportPeriod
  onPeriodChange: (period: ReportPeriod) => void
  category: string
  onCategoryChange: (category: string) => void
  categories: string[]
}

export function ReportFilters({
  period,
  onPeriodChange,
  category,
  onCategoryChange,
  categories,
}: ReportFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
      {/* Period toggle buttons */}
      <div className="flex items-center gap-1">
        <CalendarDays className="size-4 text-muted-foreground" />
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => onPeriodChange(p.key)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                period === p.key
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <Select
        value={category || "_all"}
        onValueChange={(v) => onCategoryChange(v === "_all" ? "" : v ?? "")}
      >
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Todas las categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">Todas las categorias</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
