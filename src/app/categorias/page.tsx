"use client"

import { useState, useMemo, useCallback } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { CategoryOverview } from "@/components/categorias/CategoryOverview"
import { CategoryGrid } from "@/components/categorias/CategoryGrid"
import { CategoryDetailPanel } from "@/components/categorias/CategoryDetailPanel"
import { CategoryDialog } from "@/components/categorias/CategoryDialog"
import { Button } from "@/components/ui/button"
import { List, LayoutGrid, Plus } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import { useProducts } from "@/hooks/use-products"
import { addCategory, updateCategory } from "@/data/mock-categories"
import { computeCategoryOverview } from "@/lib/categories"
import type { Category } from "@/types/inventory"

export default function CategoriasPage() {
  const { categories, loading: catLoading, refresh: refreshCats } = useCategories()
  const { products, loading: prodLoading } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories.filter((c) =>
      c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    )
  }, [categories, searchQuery])

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null

  const overview = useMemo(
    () => computeCategoryOverview(categories.length, products),
    [categories, products]
  )

  const handleSaveCategory = useCallback(
    async (data: Omit<Category, "id" | "createdAt">) => {
      if (editingCategory) {
        updateCategory(editingCategory.id, data)
      } else {
        addCategory(data)
      }
      setIsDialogOpen(false)
      setEditingCategory(null)
      await refreshCats()
    },
    [editingCategory, refreshCats]
  )

  const handleEditCategory = useCallback((cat: Category) => {
    setEditingCategory(cat)
    setIsDialogOpen(true)
  }, [])

  const isLoading = catLoading || prodLoading

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar title="Categorias" searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 p-6 space-y-6 relative">
        {!isLoading && (
          <CategoryOverview
            totalCategories={overview.totalCategories}
            categorizedProducts={overview.categorizedProducts}
            totalValue={overview.totalValue}
          />
        )}

        {/* Toolbar */}
        <div className="bg-card rounded-xl border border-border/40 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <Button
              className="bg-brand-600 hover:bg-brand-700 text-white gap-2 h-9 px-4 text-sm"
              onClick={() => { setEditingCategory(null); setIsDialogOpen(true) }}
              disabled={isLoading}
            >
              <Plus size={16} />
              Nueva Categoria
            </Button>

            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/30">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 h-9 text-xs font-medium transition-colors ${
                  viewMode === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Cuadricula"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 h-9 text-xs font-medium transition-colors ${
                  viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Lista"
              >
                <List size={14} />
              </button>
            </div>
          </div>

          <div className="px-4 py-3">
            <span className="text-xs text-muted-foreground font-medium">
              {filteredCategories.length} categoria{filteredCategories.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm bg-card rounded-xl border">
            Cargando categorias...
          </div>
        ) : (
          <CategoryGrid
            categories={filteredCategories}
            products={products}
            onSelectCategory={setSelectedCategoryId}
          />
        )}
      </main>

      {selectedCategory && (
        <CategoryDetailPanel
          category={selectedCategory}
          products={products}
          onClose={() => setSelectedCategoryId(null)}
        />
      )}

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingCategory(null)
        }}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  )
}
