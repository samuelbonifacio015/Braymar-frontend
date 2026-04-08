"use client"

import { Gauge, AlertTriangle, CheckCircle2, Package } from "lucide-react"

import type { StockThreshold } from "@/types/settings"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ThresholdSettingsProps {
  threshold: StockThreshold
  onUpdate: (threshold: StockThreshold) => void
}

export function ThresholdSettings({ threshold, onUpdate }: ThresholdSettingsProps) {
  const handleChange = (value: number) => {
    const clamped = Math.max(1, Math.min(999, value))
    onUpdate({ ...threshold, global: clamped })
  }

  // Preview visual de cómo se vería un producto con este umbral
  const previewExamples = [
    { stock: 0, label: "Agotado" },
    { stock: Math.floor(threshold.global / 2) || 1, label: "Bajo stock" },
    { stock: threshold.global, label: "Bajo stock (límite)" },
    { stock: threshold.global + 10, label: "Óptimo" },
  ]

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Gauge size={18} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Umbrales de Stock</h2>
            <p className="text-xs text-gray-500">
              Define cuándo un producto se marca como &quot;bajo stock&quot;
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Input numérico con slider visual */}
        <div className="flex flex-col gap-3">
          <label
            htmlFor="global-threshold"
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Umbral global
          </label>

          <div className="flex items-center gap-4">
            <Input
              id="global-threshold"
              type="number"
              min={1}
              max={999}
              value={threshold.global}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(Number(e.target.value))
              }
              className="max-w-[100px] rounded-lg border-gray-200 text-center font-semibold text-lg"
            />
            <span className="text-sm text-gray-500">unidades</span>
          </div>

          {/* Slider visual */}
          <div className="relative">
            <input
              type="range"
              min={1}
              max={100}
              value={Math.min(threshold.global, 100)}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              aria-label="Ajustar umbral global de stock"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-400">1</span>
              <span className="text-[10px] text-gray-400">50</span>
              <span className="text-[10px] text-gray-400">100+</span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Los productos con stock menor o igual a{" "}
            <span className="font-bold text-gray-900">{threshold.global}</span>{" "}
            unidades serán marcados como &quot;bajo stock&quot; automáticamente.
          </p>
        </div>

        {/* Preview: cómo se vería */}
        <div className="border-t border-gray-100 pt-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Vista previa con umbral actual
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {previewExamples.map((ex) => {
              const isAgotado = ex.stock === 0
              const isBajo = !isAgotado && ex.stock <= threshold.global
              const isOptimo = ex.stock > threshold.global

              return (
                <div
                  key={ex.label}
                  className={cn(
                    "rounded-xl p-3 border transition-colors",
                    isAgotado && "bg-red-50 border-red-200",
                    isBajo && "bg-amber-50 border-amber-200",
                    isOptimo && "bg-emerald-50 border-emerald-200"
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {isAgotado && <AlertTriangle size={12} className="text-red-500" />}
                    {isBajo && <Package size={12} className="text-amber-600" />}
                    {isOptimo && <CheckCircle2 size={12} className="text-emerald-600" />}
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isAgotado && "text-red-700",
                        isBajo && "text-amber-700",
                        isOptimo && "text-emerald-700"
                      )}
                    >
                      {ex.label}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {ex.stock} <span className="text-xs font-normal text-gray-400">uds</span>
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
