"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { type Product } from "@/types/inventory"
import { cn } from "@/lib/utils"

/** Colores distintivos para cada ubicación */
const LOCATION_COLORS: Record<string, string> = {
  "Almacén Tienda": "#2563eb",
  "Cochera": "#f59e0b",
  "Cangallo": "#10b981",
  "Santa Anita": "#8b5cf6",
}

interface StockByWarehouseChartProps {
  products: Product[]
  className?: string
}

interface LocationData {
  location: string
  stock: number
  color: string
}

export function StockByWarehouseChart({
  products,
  className,
}: StockByWarehouseChartProps) {
  const data: LocationData[] = useMemo(() => {
    const grouped = new Map<string, number>()

    for (const product of products) {
      const current = grouped.get(product.location) ?? 0
      grouped.set(product.location, current + product.stock)
    }

    return Array.from(grouped.entries()).map(([location, stock]) => ({
      location,
      stock,
      color: LOCATION_COLORS[location] ?? "#6b7280",
    }))
  }, [products])

  return (
    <div className={cn("bg-card rounded-xl border border-border/40 shadow-sm p-5", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Stock por Ubicación
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Unidades almacenadas por almacén
        </p>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="location"
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`${Number(value)} unidades`, "Stock"]}
            />
            <Bar dataKey="stock" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda */}
      <div className="mt-3 flex flex-wrap gap-3 justify-center">
        {data.map((item) => (
          <div key={item.location} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] text-muted-foreground">
              {item.location}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
