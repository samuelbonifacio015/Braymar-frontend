"use client"

import { useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { type Product } from "@/types/inventory"
import { cn } from "@/lib/utils"

/** Paleta de colores para categorías */
const COLORS = [
  "#2563eb",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#f97316",
]

interface CategoryDistributionChartProps {
  products: Product[]
  className?: string
}

interface CategoryData {
  category: string
  count: number
}

export function CategoryDistributionChart({
  products,
  className,
}: CategoryDistributionChartProps) {
  const data: CategoryData[] = useMemo(() => {
    const grouped = new Map<string, number>()

    for (const product of products) {
      const current = grouped.get(product.category) ?? 0
      grouped.set(product.category, current + 1)
    }

    return Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count }))
  }, [products])

  return (
    <div className={cn("bg-card rounded-xl border border-border/40 shadow-sm p-5", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Distribución por Categoría
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Cantidad de productos por categoría
        </p>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={80}
              strokeWidth={2}
              stroke="#fff"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda de categorías */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-[11px] text-muted-foreground">
              {item.category} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
