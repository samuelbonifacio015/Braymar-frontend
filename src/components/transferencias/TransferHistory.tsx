"use client"

import type { Transfer } from "@/types/transfers"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TransferStatusBadge } from "./TransferStatusBadge"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface TransferHistoryProps {
  transfers: Transfer[]
  onCompleteTransfer: (id: string) => void
}

export function TransferHistory({ transfers, onCompleteTransfer }: TransferHistoryProps) {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No hay transferencias registradas
              </TableCell>
            </TableRow>
          ) : (
            transfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell className="text-sm tabular-nums whitespace-nowrap">
                  {new Date(transfer.createdAt).toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{transfer.productName}</span>
                    <span className="text-xs text-muted-foreground">{transfer.sku}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{transfer.origin}</TableCell>
                <TableCell className="text-sm">{transfer.destination}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {transfer.quantity}
                </TableCell>
                <TableCell>
                  <TransferStatusBadge status={transfer.status} />
                </TableCell>
                <TableCell>
                  {transfer.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 h-8 text-xs"
                      onClick={() => onCompleteTransfer(transfer.id)}
                    >
                      <CheckCircle size={12} />
                      Completar
                    </Button>
                  )}
                  {transfer.status !== "pending" && (
                    <span className="text-xs text-muted-foreground">&mdash;</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
