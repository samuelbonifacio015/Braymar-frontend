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
import { CheckCircle, Archive, Trash2, ArchiveX } from "lucide-react"

interface TransferHistoryProps {
  transfers: Transfer[]
  onCompleteTransfer: (id: string) => void
  onArchiveTransfer: (id: string) => void
  onDeleteTransfer: (id: string) => void
  showArchived: boolean
}

export function TransferHistory({
  transfers,
  onCompleteTransfer,
  onArchiveTransfer,
  onDeleteTransfer,
  showArchived
}: TransferHistoryProps) {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-white">
      {showArchived && transfers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ArchiveX size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay transferencias archivadas</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Tal vez deberías archivar alguna transferencia completada o cancelada para dar más orden a esa lista.
          </p>
        </div>
      ) : transfers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Archive size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay transferencias registradas</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Crea una nueva transferencia para comenzar a gestionar el movimiento de stock entre almacenes.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider w-[120px]">Fecha</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider w-[120px]">Producto</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider w-[120px]">Origen</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider w-[120px]">Destino</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider text-right">Cantidad</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider w-[120px]">Estado</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs tracking-wider w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer) => (
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
                  <div className="flex gap-1">
                    {transfer.status === "pending" && transfer.archived !== "archived" && (
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
                    {transfer.status !== "pending" && transfer.archived !== "archived" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 h-8 text-xs"
                        onClick={() => onArchiveTransfer(transfer.id)}
                        title="Archivar transferencia"
                      >
                        <Archive size={12} />
                        Archivar
                      </Button>
                    )}
                    {transfer.archived === "archived" && (
                      <>
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => onDeleteTransfer(transfer.id)}
                          title="Eliminar transferencia"
                        >
                          <Trash2 size={12} />
                          Eliminar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
