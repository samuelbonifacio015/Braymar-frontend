"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { ProductTable } from "@/components/inventario/ProductTable"
import { ProductGrid } from "@/components/inventario/ProductGrid"
import { ProductCardList } from "@/components/inventario/ProductCardList"
import { ProductLocations } from "@/components/inventario/ProductLocations"
import { MetricCards } from "@/components/inventario/MetricCards"
import { PriceModal } from "@/components/inventario/PriceModal"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FileText,Download,Plus,ListTree,LayoutGrid,Columns,List,Upload } from "lucide-react"
import { Product, Location } from "@/types/inventory"
import { addProduct } from "@/actions/inventory"
import { useProducts } from "@/hooks/use-products"
import { computeInventoryStats } from "@/lib/inventory"

export type ViewMode = "list" | "grid" | "column" | "location"

const VIEW_OPTIONS: { value: ViewMode; label: string; icon: React.ElementType }[] = [
  { value: "list", label: "Lista", icon: ListTree },
  { value: "grid", label: "Cuadricula", icon: LayoutGrid },
  { value: "column", label: "Columnas", icon: Columns },
  { value: "location", label: "Almacenes", icon: List },
]

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
    sku: "",
    category: "",
    location: "Almacén Tienda" as Location,
    stock: 0,
    unitPrice: 0,
    wholesalePrice: 0,
    unitsPerBox: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [addPending, setAddPending] = useState(false)

  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [priceProduct, setPriceProduct] = useState<Product | null>(null)
  const stats = useMemo(() => computeInventoryStats(products), [products])

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
    fd.set("sku", newProduct.sku)
    fd.set("category", newProduct.category)
    fd.set("location", newProduct.location)
    fd.set("stock", String(newProduct.stock))
    fd.set("unitPrice", String(newProduct.unitPrice))
    fd.set("wholesalePrice", String(newProduct.wholesalePrice || 0))
    fd.set("unitsPerBox", newProduct.unitsPerBox)
    if (imageFile) fd.set("image", imageFile)
    setAddPending(true)
    const res = await addProduct(fd)
    setAddPending(false)
    if (res.success) {
      setIsAddOpen(false)
      setImageFile(null)
      setNewProduct({ name: "", sku: "", category: "", location: "Almacén Tienda", stock: 0, unitPrice: 0, wholesalePrice: 0, unitsPerBox: "" })
      await refresh()
    }
  }, [newProduct, imageFile, refresh])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar title="Gestión de Inventario" searchQuery={searchQuery} onSearchChange={onSearchChange} />

      <main className="flex-1 p-6 space-y-6">
        {!loading && <MetricCards {...stats} />}

        {/* Toolbar Card */}
        <div className="bg-card rounded-lg border border-border/40 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              {loading ? (
                <Button className="bg-brand-600 text-white gap-2 h-9 px-4 text-sm" disabled>Cargando...</Button>
              ) : (
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger
                    render={
                      <Button className="bg-brand-600 hover:bg-brand-700 text-white gap-2 h-9 px-4 text-sm">
                        <Plus size={16} />
                        Añadir Producto
                      </Button>
                    }
                  />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Añadir Nuevo Producto</DialogTitle>
                      <DialogDescription>Complete los datos del nuevo producto para agregarlo al inventario.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                      {/* Row 1: Name */}
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Nombre *</label>
                        <Input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Ej. Cuaderno rayado A4" />
                      </div>

                      {/* Row 2: SKU + Category */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">SKU</label>
                          <Input value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} placeholder="Auto-generado si vacio" />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Categoría *</label>
                          <Input value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="Ej. Cuadernos" />
                        </div>
                      </div>

                      {/* Row 3: Location */}
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Ubicación *</label>
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

                      {/* Row 4: Stock + Unit Price */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Stock</label>
                          <Input type="number" min="0" value={newProduct.stock === 0 ? "" : newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Precio Unit. (S/)</label>
                          <Input type="number" step="0.01" value={newProduct.unitPrice === 0 ? "" : newProduct.unitPrice} onChange={e => setNewProduct({...newProduct, unitPrice: parseFloat(e.target.value) || 0})} />
                        </div>
                      </div>

                      {/* Row 5: Wholesale Price */}
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Precio Mayorista (S/)</label>
                        <Input type="number" step="0.01" value={newProduct.wholesalePrice === 0 ? "" : newProduct.wholesalePrice} onChange={e => setNewProduct({...newProduct, wholesalePrice: parseFloat(e.target.value) || 0})} placeholder="85% del precio unit. por defecto" />
                      </div>

                      {/* Row 6: Units per Box */}
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Unds. por caja</label>
                        <Input type="number" min="1" value={newProduct.unitsPerBox} onChange={e => setNewProduct({...newProduct, unitsPerBox: e.target.value})} placeholder="Ej. 24" />
                      </div>

                      {/* Row 7: Image upload */}
                      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Imagen del producto</label>
                        <div className="flex items-center gap-3">
                          <Button type="button" variant="outline" size="sm" className="gap-2 h-9" onClick={() => fileInputRef.current?.click()}>
                            <Upload size={14} />
                            {imageFile ? imageFile.name : "Seleccionar"}
                          </Button>
                          {imageFile && (
                            <span className="text-xs text-muted-foreground">{(imageFile.size / 1024).toFixed(1)} KB — <button type="button" className="text-destructive underline" onClick={() => { setImageFile(null); fileInputRef.current!.value = "" }}>Quitar</button></span>
                          )}
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
              <Button variant="outline" className="gap-2 h-9 text-sm font-medium">
                <Download size={16} /> CSV
              </Button>
              <Button variant="outline" className="gap-2 h-9 text-sm font-medium">
                <FileText size={16} /> PDF
              </Button>
            </div>

            {/* View switcher */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/30">
              {VIEW_OPTIONS.map(v => (
                <button
                  key={v.value}
                  onClick={() => { setViewMode(v.value); setCurrentPage(1) }}
                  className={`flex items-center gap-1.5 px-3 h-9 text-xs font-medium transition-colors ${
                    viewMode === v.value
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={v.label}
                >
                  <v.icon size={14} />
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-3 flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={onFilterChange(setCategoryFilter)}>
                <SelectTrigger className="w-[170px] h-9 bg-white text-xs font-medium">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Categoría: Todas</SelectItem>
                  {categories.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={onFilterChange(setLocationFilter)}>
                <SelectTrigger className="w-[170px] h-9 bg-white text-xs font-medium">
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
                <SelectTrigger className="w-[150px] h-9 bg-white text-xs font-medium">
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
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm bg-card rounded-lg border">
            Cargando productos...
          </div>
        ) : viewMode === "list" ? (
          <ProductTable products={paginatedProducts} onShowPrice={setPriceProduct} />
        ) : viewMode === "grid" ? (
          <ProductGrid products={paginatedProducts} onShowPrice={setPriceProduct} />
        ) : viewMode === "column" ? (
          <ProductCardList products={paginatedProducts} onShowPrice={setPriceProduct} />
        ) : (
          <ProductLocations products={filteredProducts} />
        )}

        {!loading && totalPages > 0 && viewMode !== "location" && (
          <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
            <span>Mostrando {filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} productos</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 px-4" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Anterior</Button>
              <Button variant="outline" size="sm" className="h-9 px-4 font-medium" disabled={currentPage >= totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Siguiente</Button>
            </div>
          </div>
        )}

        <PriceModal
          product={priceProduct}
          open={!!priceProduct}
          onOpenChange={(open) => !open && setPriceProduct(null)}
        />
      </main>
    </div>
  )
}
