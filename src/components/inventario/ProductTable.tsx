"use client"
import Image from "next/image"
import { Pencil, Clock, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StockBadge } from "./StockBadge"
import { Product } from "@/types/inventory"

interface ProductTableProps {
  products: Product[]
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-gray-500 text-xs tracking-wider w-[120px]">ID / SKU</TableHead>
            <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">PRODUCTO</TableHead>
            <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">STOCK DISPONIBLE</TableHead>
            <TableHead className="font-semibold text-gray-500 text-xs tracking-wider">UBICACIÓN</TableHead>
            <TableHead className="font-semibold text-gray-500 text-xs tracking-wider text-right">PRECIO UNITARIO</TableHead>
            <TableHead className="font-semibold text-gray-500 text-xs tracking-wider text-center w-[120px]">ACCIONES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors group">
              <TableCell className="font-medium text-gray-500 text-sm">
                <span className="text-gray-400 mr-1">#</span>
                {product.sku}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 relative bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden">
                    {/* Placeholder for Product Image using Lucide Icon or initials if image fails, assuming we just use gray square for now per reference */}
                    <div className="w-6 h-6 bg-orange-200 rounded-sm"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 leading-tight">{product.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StockBadge status={product.stockStatus} stock={product.stock} />
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">{product.location}</span>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-medium text-gray-900">S/ {product.unitPrice.toFixed(2)}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors">
                    <Clock size={18} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
