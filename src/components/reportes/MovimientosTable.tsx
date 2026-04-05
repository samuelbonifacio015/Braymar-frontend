"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { mockMovements } from "@/data/mock-movements"
import { cn } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, Scale } from "lucide-react"

const MOVEMENT_CONFIG: Record<
  string,
  { label: string; icon: typeof ArrowDownLeft; variant: "default" | "destructive" | "secondary" | "outline" }
> = {
  entrada: { label: "Entrada", icon: ArrowDownLeft, variant: "default" },
  salida: { label: "Salida", icon: ArrowUpRight, variant: "destructive" },
  transferencia: { label: "Transferencia", icon: ArrowRightLeft, variant: "secondary" },
  ajuste: { label: "Ajuste", icon: Scale, variant: "outline" },
}

// Show recent 15 movements
const RECENT_MOVEMENTS = mockMovements.slice(0, 15)

export function MovimientosTable() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead>Ubicacion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RECENT_MOVEMENTS.map((movement) => {
              const config = MOVEMENT_CONFIG[movement.type]
              const Icon = config.icon
              const location =
                movement.type === "transferencia"
                  ? `${movement.fromLocation} -> ${movement.toLocation}`
                  : (movement.toLocation ?? movement.fromLocation ?? "-")
              const date = new Date(movement.createdAt)
              const formattedDate = date.toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })

              return (
                <TableRow key={movement.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {formattedDate}
                  </TableCell>
                  <TableCell className="font-medium">{movement.productName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={config.variant}
                      className="gap-1"
                    >
                      <Icon className="size-3" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      movement.type === "salida"
                        ? "text-red-600"
                        : movement.type === "entrada"
                          ? "text-green-600"
                          : ""
                    )}
                  >
                    {movement.type === "salida" ||
                    (movement.type === "ajuste" && movement.quantity < 0)
                      ? movement.quantity
                      : movement.type === "ajuste"
                        ? `+${movement.quantity}`
                        : `+${movement.quantity}`}
                  </TableCell>
                  <TableCell className="text-sm">{location}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
