"use client"

import type { Product } from "@/types/inventory"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface MargenesTableProps {
  products: Product[]
}

// Determine margin badge color based on threshold
function getMarginBadgeVariant(marginPercent: number) {
  if (marginPercent > 15) return "default"
  if (marginPercent >= 10) return "secondary"
  return "destructive"
}

export function MargenesTable({ products }: MargenesTableProps) {
  // Calculate average margin
  const avgMargin =
    products.length > 0
      ? products.reduce((sum, p) => {
          const margin = ((p.unitPrice - p.wholesalePrice) / p.unitPrice) * 100
          return sum + margin
        }, 0) / products.length
      : 0

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Productos</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Margen Promedio</p>
          <p className="text-2xl font-bold">
            {avgMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Margins table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Precio Venta</TableHead>
              <TableHead className="text-right">Precio Mayorista</TableHead>
              <TableHead className="text-right">Margen %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const margin =
                ((product.unitPrice - product.wholesalePrice) /
                  product.unitPrice) *
                100

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    S/{" "}
                    {product.unitPrice.toLocaleString("es-PE", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    S/{" "}
                    {product.wholesalePrice.toLocaleString("es-PE", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getMarginBadgeVariant(margin)}>
                      {margin.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>Margen:</span>
        <Badge variant="default" className="text-xs">&gt; 15%</Badge>
        <Badge variant="secondary" className="text-xs">10%-15%</Badge>
        <Badge variant="destructive" className="text-xs">&lt; 10%</Badge>
      </div>
    </div>
  )
}
