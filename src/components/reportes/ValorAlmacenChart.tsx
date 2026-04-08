"use client"

import type { Product, Location } from "@/types/inventory"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

interface ValorAlmacenChartProps {
  products: Product[]
}

const LOCATION_COLORS: Record<string, string> = {
  "Almacén Tienda": "#0ea5e9", // sky-500
  "Cochera": "#f59e0b", // amber-500
  "Cangallo": "#8b5cf6", // violet-500
  "Santa Anita": "#10b981", // emerald-500
}

export function ValorAlmacenChart({ products }: ValorAlmacenChartProps) {
  // Group products by location, sum(stock * cost) for true value, and sum(stock * unitPrice) for potential revenue
  const valueByLocation = products.reduce<
    { location: Location; totalCost: number; potentialRevenue: number; totalStock: number; productCount: number }[]
  >((acc, product) => {
    const existing = acc.find((item) => item.location === product.location)
    const costValue = product.stock * (product.cost || product.wholesalePrice * 0.7) // fallback just in case
    const revenueValue = product.stock * product.unitPrice

    if (existing) {
      existing.totalCost += costValue
      existing.potentialRevenue += revenueValue
      existing.totalStock += product.stock
      existing.productCount += 1
    } else {
      acc.push({
        location: product.location,
        totalCost: costValue,
        potentialRevenue: revenueValue,
        totalStock: product.stock,
        productCount: 1,
      })
    }
    return acc
  }, []).sort((a, b) => b.totalCost - a.totalCost)

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 backdrop-blur-md border border-gray-100 p-3 rounded-xl shadow-xl outline-none">
          <p className="font-bold text-sm text-gray-900 mb-2 border-b border-gray-100 pb-2">{data.location}</p>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex justify-between gap-4">
              <span>Costo Inmovilizado:</span>
              <span className="font-semibold text-gray-900">S/ {data.totalCost.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</span>
            </p>
            <p className="text-xs text-gray-500 flex justify-between gap-4">
              <span>Ingreso Potencial:</span>
              <span className="font-semibold text-brand-600">S/ {data.potentialRevenue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom Legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-col gap-2 pt-2">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-medium text-gray-600">{entry.value}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 leading-tight">Valor Inmovilizado</h3>
        <p className="text-[11px] text-gray-400 font-medium">Costo de inventario actual por recinto</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 relative min-h-[220px]">
        <div className="w-full h-[220px] absolute inset-0 sm:relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={valueByLocation}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                dataKey="totalCost"
                nameKey="location"
                stroke="none"
              >
                {valueByLocation.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={LOCATION_COLORS[entry.location] || "#94a3b8"} 
                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Info panel aside */}
        <div className="w-full shrink-0 flex flex-col gap-3 mt-4 sm:mt-0 z-10 px-2 sm:px-0 bg-white/50 backdrop-blur-md rounded-xl p-2 sm:bg-transparent">
          {valueByLocation.map((wh) => (
            <div key={wh.location} className="flex items-center justify-between group">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-1.5 h-4 rounded-full" 
                  style={{ backgroundColor: LOCATION_COLORS[wh.location] || "#94a3b8" }} 
                />
                <div>
                  <p className="text-xs font-semibold text-gray-800">{wh.location}</p>
                  <p className="text-[10px] text-gray-400">{wh.totalStock.toLocaleString()} unidades</p>
                </div>
              </div>
              <p className="text-xs font-bold text-gray-900 tabular-nums">
                S/ {(wh.totalCost / 1000).toFixed(1)}k
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
