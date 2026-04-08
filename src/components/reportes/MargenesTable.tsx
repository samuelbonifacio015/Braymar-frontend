"use client"

import type { Product } from "@/types/inventory"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from "recharts"
import { DollarSign } from "lucide-react"

interface MargenesTableProps {
  products: Product[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const cost = payload.find((p: any) => p.dataKey === "cost")?.value || 0
    const wholesale = payload.find((p: any) => p.dataKey === "wholesalePrice")?.value || 0
    const retail = payload.find((p: any) => p.dataKey === "unitPrice")?.value || 0
    
    // Calculates
    const wholesaleMargin = wholesale - cost;
    const retailMargin = retail - cost;
    const percentWholesale = ((wholesaleMargin / wholesale) * 100).toFixed(0);
    const percentRetail = ((retailMargin / retail) * 100).toFixed(0);

    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 p-3.5 rounded-xl shadow-[0_12px_24px_-4px_rgba(0,0,0,0.1)] outline-none min-w-[220px]">
        <p className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-100 pb-2">{label}</p>
        
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Mayorista: S/ {wholesale.toFixed(2)}</span>
              <span className="text-indigo-600 font-bold">+{percentWholesale}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Minorista: S/ {retail.toFixed(2)}</span>
              <span className="text-emerald-600 font-bold">+{percentRetail}%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400">Costo Base</span>
            <span className="text-sm font-black text-gray-800">S/ {cost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function MargenesTable({ products }: MargenesTableProps) {
  // Solo mostramos un set para que no sea inmanejable visualmente
  const chartData = products.map(p => ({
    name: p.name,
    cost: p.cost || p.wholesalePrice * 0.7,
    wholesalePrice: p.wholesalePrice,
    unitPrice: p.unitPrice,
    marginWholesale: p.wholesalePrice - (p.cost || p.wholesalePrice * 0.7)
  })).sort((a, b) => b.wholesalePrice - a.wholesalePrice).slice(0, 8); // Top 8 by price for clarity

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col h-full w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
            Márgenes y Estructura de Costos <DollarSign size={18} className="text-emerald-500" />
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">Comparativa de precio de adquisición vs venta al público/mayorista</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-200"></div>Costo Base</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-200"></div>Mayorista</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-1 rounded bg-emerald-400"></div>PVP (Minorista)</div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: "#64748b" }} 
              axisLine={{ stroke: '#e2e8f0' }} 
              tickLine={false} 
              dy={10} 
              tickFormatter={(val) => val.split(" ")[0] } // Truncate to first word for space
            />
            <YAxis 
              tickFormatter={(v) => `S/${v}`} 
              tick={{ fontSize: 11, fill: "#94a3b8" }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
            
            {/* Base Cost */}
            <Bar dataKey="cost" stackId="a" fill="#e2e8f0" radius={[0, 0, 4, 4]} barSize={28} />
            {/* Wholesale Added Margin */}
            <Bar dataKey="marginWholesale" stackId="a" fill="#c7d2fe" radius={[4, 4, 0, 0]} barSize={28} />
            
            {/* Unit Price Line overlay */}
            <Line 
              type="monotone" 
              dataKey="unitPrice" 
              stroke="#34d399" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#10b981" }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
