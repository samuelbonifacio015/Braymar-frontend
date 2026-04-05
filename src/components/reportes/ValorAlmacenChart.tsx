"use client"

import type { Product, Location } from "@/types/inventory"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ValorAlmacenChartProps {
  products: Product[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]

export function ValorAlmacenChart({ products }: ValorAlmacenChartProps) {
  // Group products by location, sum(stock * unitPrice)
  const valueByLocation = products.reduce<
    { location: Location; totalValue: number; totalStock: number; productCount: number }[]
  >((acc, product) => {
    const existing = acc.find((item) => item.location === product.location)
    const value = product.stock * product.unitPrice

    if (existing) {
      existing.totalValue += value
      existing.totalStock += product.stock
      existing.productCount += 1
    } else {
      acc.push({
        location: product.location,
        totalValue: value,
        totalStock: product.stock,
        productCount: 1,
      })
    }
    return acc
  }, [])

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {valueByLocation.map((wh) => (
          <div key={wh.location} className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground truncate">{wh.location}</p>
            <p className="text-xl font-bold">
              S/ {wh.totalValue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {wh.productCount} productos | {wh.totalStock.toLocaleString("es-PE")} uds.
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-4">Valor de Inventario por Almacen</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={valueByLocation}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v: number) => `S/ ${v}`}
              width={80}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value) => {
                const num = typeof value === "number" ? value : 0
                return [
                  `S/ ${num.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
                  "Valor Total",
                ]
              }}
            />
            <Legend />
            <Bar dataKey="totalValue" name="Valor Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
