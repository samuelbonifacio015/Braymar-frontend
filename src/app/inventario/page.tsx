"use client"
import { Topbar } from "@/components/layout/Topbar"
import { ProductTable } from "@/components/inventario/ProductTable"
import { getProducts } from "@/data/mock"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Plus } from "lucide-react"

export default function InventarioPage() {
  const products = getProducts()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar title="Gestión de Inventario" />
      
      <main className="flex-1 p-6 space-y-6">
        {/* Action & Filter Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button className="bg-brand-600 hover:bg-brand-700 text-white gap-2 h-10 px-4">
              <Plus size={18} />
              Añadir Producto
            </Button>
            
            <Button variant="outline" className="gap-2 h-10 border-gray-200 text-gray-700 font-medium bg-white">
              <Download size={18} />
              CSV
            </Button>
            
            <Button variant="outline" className="gap-2 h-10 border-gray-200 text-gray-700 font-medium bg-white">
              <FileText size={18} />
              PDF
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Select defaultValue="todas">
              <SelectTrigger className="w-[180px] h-10 bg-white border-gray-200 text-gray-600 font-medium">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Categoría: Todas</SelectItem>
                <SelectItem value="cuadernos">Cuadernos</SelectItem>
                <SelectItem value="escritura">Escritura</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="todas">
              <SelectTrigger className="w-[180px] h-10 bg-white border-gray-200 text-gray-600 font-medium">
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Ubicación: Todas</SelectItem>
                <SelectItem value="tienda">Almacén Tienda</SelectItem>
                <SelectItem value="cochera">Cochera</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="todos">
              <SelectTrigger className="w-[160px] h-10 bg-white border-gray-200 text-gray-600 font-medium">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Estado: Todos</SelectItem>
                <SelectItem value="optimo">Óptimo</SelectItem>
                <SelectItem value="bajo">Bajo Stock</SelectItem>
                <SelectItem value="agotado">Agotado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <ProductTable products={products} />

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
          <span>Mostrando 1–8 de 128 productos</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 px-4 text-gray-600" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4 text-gray-600 font-medium">
              Siguiente
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
