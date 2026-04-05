"use client"

import type { Product } from "@/types/inventory"
import { dailySalesData } from "@/data/mock-sales"
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

interface MasVendidosChartProps {
  products: Product[]
}

// Generate mock sales units per product based on dailySalesData
function generateMockSalesData(products: Product[]) {
  // Distribute total units from dailySalesData proportionally across products
  const totalUnits = dailySalesData.reduce((s, d) => s + d.units, 0)

  // Assign mock units based on product index weight (descending)
  return products
    .map((product, index) => {
      // Weight: earlier products sell more
      const weight = Math.max(1, products.length - index)
      const totalWeight = products.reduce(
        (s, _, i) => s + Math.max(1, products.length - i),
        0
      )
      const unitsSold = Math.round((weight / totalWeight) * totalUnits)
      const revenue = unitsSold * product.unitPrice

      return {
        productId: product.id,
        productName: product.name,
        unitsSold,
        revenue,
      }
    })
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 10)
}

export function MasVendidosChart({ products }: MasVendidosChartProps) {
  const topProducts = generateMockSalesData(products)

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-4">Top 10 Productos por Unidades Vendidas</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={topProducts}
            margin={{ left: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="productName"
              tick={{ fontSize: 11 }}
              width={200}
            />
            <Tooltip
              formatter={(value) => {
                const num = typeof value === "number" ? value : 0
                return [
                  num,
                  "Unidades",
                ]
              }}
            />
            <Legend />
            <Bar dataKey="unitsSold" fill="#10b981" name="Unidades" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-2 text-left font-medium">#</th>
              <th className="p-2 text-left font-medium">Producto</th>
              <th className="p-2 text-right font-medium">Unidades</th>
              <th className="p-2 text-right font-medium">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((item, index) => (
              <tr key={item.productId} className="border-b last:border-0">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.productName}</td>
                <td className="p-2 text-right">{item.unitsSold}</td>
                <td className="p-2 text-right font-medium">
                  S/ {item.revenue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
