import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MovementTypeBadge } from "./MovementTypeBadge"
import type { StockMovement } from "@/types/movements"

const PAGE_SIZE = 10

interface MovementTableProps {
  movements: StockMovement[]
}

export function MovementTable({ movements }: MovementTableProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(movements.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const pageMovements = movements.slice(start, start + PAGE_SIZE)

  const formatDateTime = (iso: string): string => {
    const d = new Date(iso)
    return d.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      { /* Tabla de movimientos */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">FECHA</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">PRODUCTO</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">SKU</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">TIPO</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider text-right">CANTIDAD</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">DE</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">A</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">NOTAS</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">USUARIO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-32 text-gray-500">
                  No se encontraron movimientos con los filtros actuales.
                </TableCell>
              </TableRow>
            ) : (
              pageMovements.map((m) => (
                <TableRow key={m.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-sm text-gray-600 whitespace-nowrap">{formatDateTime(m.createdAt)}</TableCell>
                  <TableCell className="text-sm font-medium text-gray-900">{m.productName}</TableCell>
                  <TableCell className="text-sm text-gray-500">{m.sku}</TableCell>
                  <TableCell><MovementTypeBadge type={m.type} /></TableCell>
                  <TableCell className={`text-sm font-semibold text-right ${m.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                    {m.quantity > 0 ? "+" : ""}{m.quantity}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{m.fromLocation ?? "—"}</TableCell>
                  <TableCell className="text-sm text-gray-600">{m.toLocation ?? "—"}</TableCell>
                  <TableCell className="text-sm text-gray-500 max-w-[160px] truncate" title={m.notes || ""}>
                    {m.notes || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 whitespace-nowrap">{m.performedBy}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      { /* Paginacion */}
      {movements.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Mostrando {start + 1}–{Math.min(start + PAGE_SIZE, movements.length)} de {movements.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={safePage === 1}>
              <ChevronsLeft size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm text-gray-600 px-3">{safePage} / {totalPages}</span>
            <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
              <ChevronRight size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>
              <ChevronsRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
