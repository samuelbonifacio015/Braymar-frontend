"use client"

import { useState } from "react"
import { Save, Gauge } from "lucide-react"

import { mockThreshold } from "@/data/mock-settings"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ThresholdSettings() {
  const [threshold, setThreshold] = useState(mockThreshold.global)

  const handleSave = () => {
    // TODO: persistir el umbral global via API o Supabase
  }

  return (
    <section className="bg-card rounded-xl border border-border/40 shadow-sm">
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <Gauge size={17} className="text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Umbrales de Stock</h2>
              <p className="text-xs text-muted-foreground">
                Define cuando un producto se marca como &quot;bajo_stock&quot;
              </p>
            </div>
          </div>

          <Button size="sm" onClick={handleSave}>
            <Save size={14} className="mr-1" />
            Guardar
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="global-threshold"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Umbral global
          </label>
          <Input
            id="global-threshold"
            type="number"
            min={1}
            value={threshold}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setThreshold(Number(e.target.value))
            }
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground">
            Los productos con stock menor o igual a <span className="font-medium text-foreground">{threshold}</span>{" "}
            unidades seran marcados como &quot;bajo_stock&quot; automaticamente.
          </p>
        </div>
      </div>
    </section>
  )
}
