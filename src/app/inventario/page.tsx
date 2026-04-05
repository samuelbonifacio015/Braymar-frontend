"use client"

import { useState, useMemo, useCallback } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { ProductTable } from "@/components/inventario/ProductTable"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FileText, Download, Plus } from "lucide-react"
import { Product, Location } from "@/types/inventory"
import { addProduct } from "@/actions/inventory"
import { useProducts } from "@/hooks/use-products"

export default function InventarioPage() {
  const { products, loading, refresh } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("todas")
  const [locationFilter, setLocationFilter] = useState("todas")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    location: "Almacén Tienda" as Location,
    stock: 0,
    unitPrice: 0,
  })
  const [addPending, setAddPending] = useState(false)

  const categories = useMemo(() => [...new Set(products.map((p: Product) => p.category))], [products])

  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCat = categoryFilter === "todas" || p.category === categoryFilter
      const matchLoc = locationFilter === "todas" || p.location === locationFilter
      let matchStatus = true
      if (statusFilter !== "todos") matchStatus = p.stockStatus === statusFilter
      return matchSearch && matchCat && matchLoc && matchStatus
    })
  }, [products, searchQuery, categoryFilter, locationFilter, statusFilter])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const onFilterChange = useCallback((setter: (v: string) => void) => (value: string | null) => {
    if (value) { setter(value); setCurrentPage(1) }
  }, [])

  const onSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  const onAddProduct = useCallback(async () => {
    if (!newProduct.name || !newProduct.category) return
    const fd = new FormData()
    fd.set("name", newProduct.name)
    fd.set("category", newProduct.category)
    fd.set("location", newProduct.location)
    fd.set("stock", String(newProduct.stock))
    fd.set("unitPrice", String(newProduct.unitPrice))
    setAddPending(true)
    const res = await addProduct(fd)
    setAddPending(false)
    if (res.success) {
      setIsAddOpen(false)
      setNewProduct({ name: "", category: "", location: "Almacén Tienda", stock: 0, unitPrice: 0 })
      await refresh()
    }
  }, [newProduct, refresh])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar title="Gestión de Inventario" searchQuery={searchQuery} onSearchChange={onSearchChange} />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {loading ? (
              <Button className="bg-brand-600 text-white gap-2 h-10 px-4" disabled>Cargando...</Button>
            ) : (
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger
                  render={
                    <Button className="bg-brand-600 hover:bg-brand-700 text-white gap-2 h-10 px-4">
                      <Plus size={18} />
                      Añadir Producto
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Añadir Nuevo Producto</DialogTitle>
                    <DialogDescription>Complete los datos del nuevo producto para agregarlo al inventario.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Nombre</label>
                      <Input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Ej. Cuaderno rayado" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Categoría</label>
                        <Input value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="Ej. Cuadernos" />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Ubicación</label>
                        <Select value={newProduct.location} onValueChange={(v: string | null) => v && setNewProduct({...newProduct, location: v as Location})}>
                          <SelectTrigger><SelectValue placeholder="Ubicación" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Almacén Tienda">Almacén Tienda</SelectItem>
                            <SelectItem value="Cochera">Cochera</SelectItem>
                            <SelectItem value="Cangallo">Cangallo</SelectItem>
                            <SelectItem value="Santa Anita">Santa Anita</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Stock</label>
                        <Input type="number" value={newProduct.stock === 0 ? "" : newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Precio Unitario (S/)</label>
                        <Input type="number" step="0.1" value={newProduct.unitPrice === 0 ? "" : newProduct.unitPrice} onChange={e => setNewProduct({...newProduct, unitPrice: parseFloat(e.target.value) || 0})} />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                    <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={onAddProduct} disabled={addPending}>
                      {addPending ? "Guardando..." : "Guardar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" className="gap-2 h-10 border-gray-200 text-gray-700 font-medium bg-white">
              <Download size={18} /> CSV
            </Button>
            <Button variant="outline" className="gap-2 h-10 border-gray-200 text-gray-700 font-medium bg-white">
              <FileText size={18} /> PDF
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Select value={categoryFilter} onValueChange={onFilterChange(setCategoryFilter)}>
              <SelectTrigger className="w-[180px] h-10 bg-white border-gray-200 text-gray-600 font-medium">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Categoría: Todas</SelectItem>
                {categories.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={onFilterChange(setLocationFilter)}>
              <SelectTrigger className="w-[180px] h-10 bg-white border-gray-200 text-gray-600 font-medium">
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Ubicación: Todas</SelectItem>
                <SelectItem value="Almacén Tienda">Almacén Tienda</SelectItem>
                <SelectItem value="Cochera">Cochera</SelectItem>
                <SelectItem value="Cangallo">Cangallo</SelectItem>
                <SelectItem value="Santa Anita">Santa Anita</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={onFilterChange(setStatusFilter)}>
              <SelectTrigger className="w-[160px] h-10 bg-white border-gray-200 text-gray-600 font-medium">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Estado: Todos</SelectItem>
                <SelectItem value="optimo">Óptimo</SelectItem>
                <SelectItem value="bajo_stock">Bajo Stock</SelectItem>
                <SelectItem value="agotado">Agotado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm bg-white rounded-lg border">
            Cargando productos...
          </div>
        ) : (
          <ProductTable products={paginatedProducts} />
        )}

        {!loading && totalPages > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
            <span>Mostrando {filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} productos</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 px-4 text-gray-600" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Anterior</Button>
              <Button variant="outline" size="sm" className="h-9 px-4 text-gray-600 font-medium" disabled={currentPage >= totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Siguiente</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
