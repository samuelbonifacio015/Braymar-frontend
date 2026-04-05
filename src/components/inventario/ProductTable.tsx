"use client"

import { useState, useRef } from "react"
import { Pencil, Clock, Trash2, DollarSign, Upload } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StockBadge } from "./StockBadge"
import { Product, Location, StockStatus } from "@/types/inventory"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStockStatus } from "@/lib/inventory"
import { updateProduct, deleteProduct } from "@/actions/inventory"
import { useRouter } from "next/navigation"

interface ProductTableProps {
  products: Product[]
  onShowPrice?: (product: Product) => void
}

export function ProductTable({ products, onShowPrice }: ProductTableProps) {
  const router = useRouter()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [savePending, setSavePending] = useState(false)
  const [deletePending, setDeletePending] = useState(false)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const handleSaveEdit = async () => {
    if (!editingProduct) return
    const fd = new FormData()
    fd.set("name", editingProduct.name)
    fd.set("category", editingProduct.category)
    fd.set("location", editingProduct.location)
    fd.set("stock", String(editingProduct.stock))
    fd.set("unitPrice", String(editingProduct.unitPrice))
    fd.set("wholesalePrice", String(editingProduct.wholesalePrice))
    if (editingProduct.unitsPerBox) fd.set("unitsPerBox", String(editingProduct.unitsPerBox))
    if (editImageFile) fd.set("image", editImageFile)
    // send existing image URL if no new file
    if (!editImageFile && editingProduct.imageUrl) fd.set("existingImageUrl", editingProduct.imageUrl)

    setSavePending(true)
    const res = await updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      location: editingProduct.location,
      stock: editingProduct.stock,
      unitPrice: editingProduct.unitPrice,
      wholesalePrice: editingProduct.wholesalePrice,
      unitsPerBox: editingProduct.unitsPerBox,
    })
    setSavePending(false)
    if (res.success) {
      setEditingProduct(null)
      setEditImageFile(null)
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!deletingProduct) return
    setDeletePending(true)
    const res = await deleteProduct(deletingProduct.id)
    setDeletePending(false)
    if (res.success) {
      setDeletingProduct(null)
      router.refresh()
    }
  }

  const mockHistoryList = [
    { id: 1, date: "24/03/2026 10:30 AM", type: "Venta", qty: -2, loc: "Almacén Tienda", user: "vendedor1" },
    { id: 2, date: "22/03/2026 09:15 AM", type: "Ingreso", qty: +50, loc: "Cochera", user: "admin@braymar.pe" },
    { id: 3, date: "18/03/2026 04:20 PM", type: "Traslado", qty: -10, loc: "Cochera a Tienda", user: "admin@braymar.pe" },
    { id: 4, date: "15/03/2026 11:00 AM", type: "Ajuste", qty: -1, loc: "Santa Anita", user: "admin@braymar.pe" },
    { id: 5, date: "10/03/2026 02:45 PM", type: "Ingreso", qty: +100, loc: "Cangallo", user: "admin@braymar.pe" },
  ]

  return (
    <>
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
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-gray-500">
                  No se encontraron productos con los filtros actuales.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <TableCell className="font-medium text-gray-500 text-sm">
                    <span className="text-gray-400 mr-1">#</span>
                    {product.sku}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 relative bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden">
                        <div className="w-6 h-6 bg-orange-200 rounded-sm"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">{product.name}</p>
                        <p className="text-xs text-brand-600 mt-0.5">{product.category}</p>
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
                      {onShowPrice && (
                        <button onClick={() => onShowPrice(product)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Ver precios">
                          <DollarSign size={18} />
                        </button>
                      )}
                      <button onClick={() => { setEditingProduct({...product}); setEditImageFile(null) }} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors" title="Editar">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => setHistoryProduct(product)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors" title="Historial">
                        <Clock size={18} />
                      </button>
                      <button onClick={() => setDeletingProduct(product)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && (setEditingProduct(null), setEditImageFile(null))}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>Modifique los campos del producto y guarde los cambios.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Row 1: Name */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Nombre *</label>
                <Input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
              </div>

              {/* Row 2: SKU + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">SKU</label>
                  <Input value={editingProduct.sku} onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Categoría *</label>
                  <Input value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} />
                </div>
              </div>

              {/* Row 3: Location */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ubicación *</label>
                <Select value={editingProduct.location} onValueChange={(v: string | null) => v && setEditingProduct({...editingProduct, location: v as Location})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Almacén Tienda">Almacén Tienda</SelectItem>
                    <SelectItem value="Cochera">Cochera</SelectItem>
                    <SelectItem value="Cangallo">Cangallo</SelectItem>
                    <SelectItem value="Santa Anita">Santa Anita</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 4: Stock + Unit Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input type="number" min="0" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Precio Unit. (S/)</label>
                  <Input type="number" step="0.01" value={editingProduct.unitPrice} onChange={e => setEditingProduct({...editingProduct, unitPrice: parseFloat(e.target.value) || 0})} />
                </div>
              </div>

              {/* Row 5: Wholesale Price */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Precio Mayorista (S/)</label>
                <Input type="number" step="0.01" value={editingProduct.wholesalePrice} onChange={e => setEditingProduct({...editingProduct, wholesalePrice: parseFloat(e.target.value) || 0})} />
              </div>

              {/* Row 6: Units per Box */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Unds. por caja</label>
                <Input type="number" min="1" value={editingProduct.unitsPerBox ?? ""} onChange={e => setEditingProduct({...editingProduct, unitsPerBox: parseInt(e.target.value) || undefined})} placeholder="Ej. 24" />
              </div>

              {/* Row 7: Image */}
              <input type="file" accept="image/*" ref={editFileInputRef} className="hidden" onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} />
              <div className="grid gap-2">
                <label className="text-sm font-medium">Imagen del producto</label>
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" size="sm" className="gap-2 h-9" onClick={() => editFileInputRef.current?.click()}>
                    <Upload size={14} />
                    {editImageFile ? editImageFile.name : editingProduct.imageUrl ? "Cambiar imagen" : "Seleccionar"}
                  </Button>
                  {(editingProduct.imageUrl || editImageFile) && (
                    <span className="text-xs text-muted-foreground">
                      {editImageFile
                        ? `${(editImageFile.size / 1024).toFixed(1)} KB`
                        : <img src={editingProduct.imageUrl} className="h-6 w-6 rounded object-cover inline-block mr-1" alt="" />}
                      <button type="button" className="text-destructive underline ml-1" onClick={() => { setEditImageFile(null); setEditingProduct({...editingProduct, imageUrl: undefined}); editFileInputRef.current!.value = "" }}>Quitar</button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancelar</Button>
            <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={handleSaveEdit} disabled={savePending}>
              {savePending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={!!historyProduct} onOpenChange={(open) => !open && setHistoryProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Historial de Movimientos - {historyProduct?.sku}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="font-semibold text-xs text-gray-500">FECHA</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-500">TIPO</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-500 text-right">CANTIDAD</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-500">UBICACIÓN</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-500">USUARIO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockHistoryList.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-sm text-gray-600">{entry.date}</TableCell>
                      <TableCell className="text-sm font-medium">{entry.type}</TableCell>
                      <TableCell className={`text-sm text-right font-medium ${entry.qty > 0 ? "text-green-600" : "text-red-600"}`}>
                        {entry.qty > 0 ? "+${entry.qty}" : entry.qty}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{entry.loc}</TableCell>
                      <TableCell className="text-sm text-gray-500">{entry.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará <strong>{deletingProduct?.name}</strong> (SKU: <strong>{deletingProduct?.sku}</strong>) permanentemente del inventario. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete} disabled={deletePending}>
              {deletePending ? "Eliminando..." : "Eliminar Producto"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
