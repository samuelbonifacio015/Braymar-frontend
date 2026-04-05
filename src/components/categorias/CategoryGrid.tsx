"use client"

import { CategoryCard } from "./CategoryCard"
import type { Category, Product } from "@/types/inventory"

interface CategoryGridProps {
  categories: Category[]
  products: Product[]
  onSelectCategory: (id: string) => void
}

export function CategoryGrid({ categories, products, onSelectCategory }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-card rounded-xl border border-border/40">
        <p className="text-muted-foreground text-sm">No se encontraron categorias</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          products={products}
          onClick={() => onSelectCategory(cat.id)}
        />
      ))}
    </div>
  )
}
