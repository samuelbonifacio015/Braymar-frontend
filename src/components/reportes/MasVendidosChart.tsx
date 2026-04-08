"use client"

import type { Product } from "@/types/inventory"
const dailySalesData = [
  { date: "Lun", revenue: 4500, units: 120 },
  { date: "Mar", revenue: 5200, units: 145 },
  { date: "Mie", revenue: 4800, units: 130 },
  { date: "Jue", revenue: 6100, units: 165 },
  { date: "Vie", revenue: 7500, units: 190 },
  { date: "Sab", revenue: 8200, units: 210 },
  { date: "Dom", revenue: 3800, units: 95 }
]
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Package, Trophy } from "lucide-react"

interface MasVendidosChartProps {
  products: Product[]
}

// Generate mock sales units per product based on dailySalesData
function generateMockSalesData(products: Product[]) {
  const totalUnits = dailySalesData.reduce((s: number, d) => s + d.units, 0)
  return products
    .map((product, index) => {
      const weight = Math.max(1, products.length - index)
      const totalWeight = products.reduce((s: number, _, i: number) => s + Math.max(1, products.length - i), 0)
      const unitsSold = Math.round((weight / totalWeight) * totalUnits)
      const revenue = unitsSold * product.unitPrice
      const margin = revenue - (unitsSold * (product.cost || product.wholesalePrice * 0.7))

      return {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        unitsSold,
        revenue,
        margin
      }
    })
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 10)
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 p-3 rounded-xl shadow-xl outline-none">
        <p className="font-bold text-sm text-gray-900 mb-2 border-b border-gray-100 pb-2">{label}</p>
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-indigo-500"/> Ingresos:</span>
            <span className="font-bold text-gray-900">S/ {payload[0].value.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</span>
          </p>
          <p className="text-xs text-gray-500 flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-amber-400"/> Unidades:</span>
            <span className="font-semibold text-gray-700">{payload[1].value} uds</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

export function MasVendidosChart({ products }: MasVendidosChartProps) {
  const topProducts = generateMockSalesData(products)

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      
      {/* Panel Izquierdo: Area Chart TENDENCIA GLOBAL */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
              Tendencia de Ventas <TrendingUp size={18} className="text-brand-500" />
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1">Evolución de ingresos y volumen por día (Últimos 7 días)</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 bg-gray-50 rounded-lg p-2 px-3 border border-gray-100">
            <div className="flex flex-col items-end">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Ingresos Acum.</p>
              <p className="text-sm font-black text-indigo-600 tabular-nums">S/ {dailySalesData.reduce((acc: number, curr) => acc + curr.revenue, 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailySalesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} dy={10} />
              <YAxis yAxisId="left" tickFormatter={(v) => `S/ ${v}`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" hide />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="left" type="monotoneX" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area yAxisId="right" type="monotoneX" dataKey="units" stroke="#fbbf24" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Panel Derecho: RANKING TOP 10 */}
      <div className="xl:w-[400px] shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col max-h-[420px]">
        <div className="flex flex-col mb-4 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
          <h3 className="text-base font-bold text-amber-900 leading-tight flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" /> Los Más Rentables
          </h3>
          <p className="text-[11px] text-amber-700/80 font-medium">Top 5 por volumen desplazado</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3">
          {topProducts.slice(0, 5).map((item, index) => (
            <div key={item.productId} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 shadow-sm font-black text-xs text-gray-500 group-hover:bg-white group-hover:text-brand-600 transition-colors">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{item.productName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-gray-400">{item.sku}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {item.unitsSold} uds.
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-gray-900 tabular-nums">S/ {(item.revenue / 1000).toFixed(1)}k</p>
                <p className="text-[10px] font-medium text-emerald-500">+{((item.margin / item.revenue) * 100).toFixed(0)}% mar.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}
