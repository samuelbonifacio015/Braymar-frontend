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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface StockGeneralReportProps {
  products: Product[]
}

export function StockGeneralReport({ products }: StockGeneralReportProps) {
  // Stock count by category for the chart
  const stockByCategory = products.reduce<
    { category: string; stock: number }[]
  >((acc, product) => {
    const existing = acc.find((item) => item.category === product.category)
    if (existing) {
      existing.stock += product.stock
    } else {
      acc.push({ category: product.category, stock: product.stock })
    }
    return acc
  }, [])

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Productos</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Stock Total</p>
          <p className="text-2xl font-bold">
            {products.reduce((s, p) => s + p.stock, 0).toLocaleString("es-PE")}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Valor Total</p>
          <p className="text-2xl font-bold">
            S/{" "}
            {products
              .reduce((s, p) => s + p.stock * p.unitPrice, 0)
              .toLocaleString("es-PE", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Stock table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Ubicacion</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      product.stockStatus === "agotado"
                        ? "destructive"
                        : product.stockStatus === "bajo_stock"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell>{product.location}</TableCell>
                <TableCell className="text-right font-medium">
                  S/{" "}
                  {(product.stock * product.unitPrice).toLocaleString("es-PE", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Stock by category chart */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-4">Stock por Categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                (typeof value === "number"
                  ? value.toLocaleString("es-PE")
                  : String(value)),
                "Stock",
              ]}
            />
            <Legend />
            <Bar dataKey="stock" fill="#3b82f6" name="Stock" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
