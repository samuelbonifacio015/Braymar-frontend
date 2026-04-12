"use client"

import { Search, X, Clock, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import type { Product } from "@/types/inventory"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

interface RecentSearch {
  id: string
  name: string
  sku: string
}

// Load recent searches from localStorage
function loadRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("recent-searches")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save recent searches to localStorage
function saveRecentSearch(search: RecentSearch) {
  if (typeof window === "undefined") return
  try {
    const existing = loadRecentSearches()
    const filtered = existing.filter((s) => s.sku !== search.sku)
    const updated = [search, ...filtered].slice(0, 5) // Keep only 5 most recent
    localStorage.setItem("recent-searches", JSON.stringify(updated))
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Create Supabase client for browser
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  return createClient(url, key)
}

export function SearchModal({
  open,
  onOpenChange,
  searchQuery,
  onSearchChange,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])

  // Load recent searches when component mounts
  useEffect(() => {
    setRecentSearches(loadRecentSearches())
  }, [])

  // Fetch products from Supabase when modal opens
  useEffect(() => {
    if (open) {
      const fetchProducts = async () => {
        setLoading(true)
        try {
          const supabase = getSupabaseClient()
          const { data, error } = await supabase
            .from("products")
            .select("*, categories(id, name)")
            .order("created_at", { ascending: false })
          
          if (!error && data) {
            const mappedProducts = data.map((row: any) => ({
              id: row.id,
              sku: row.sku,
              name: row.name,
              stock: row.stock,
              stockStatus: row.stock_status,
              location: row.location,
              unitPrice: row.unit_price,
              wholesalePrice: row.wholesale_price,
              cost: row.cost,
              categoryId: row.category_id,
              category: row.categories?.name || "Sin categoría",
              imageUrl: row.image_url,
              unitsPerBox: row.units_per_box,
            }))
            setProducts(mappedProducts)
          }
        } catch (err) {
          console.error("Error fetching products:", err)
        } finally {
          setLoading(false)
        }
      }

      fetchProducts()
    }
  }, [open])

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const showResults = searchQuery.length > 0
  const showRecent = !searchQuery || searchQuery.length === 0

  const handleProductSelect = (product: Product) => {
    // Save to recent searches
    saveRecentSearch({
      id: product.id,
      name: product.name,
      sku: product.sku,
    })
    setRecentSearches(loadRecentSearches())
    
    // Navigate to product or perform action
    console.log("Selected product:", product)
    onOpenChange(false)
  }

  const clearSearch = () => {
    onSearchChange("")
    inputRef.current?.focus()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Custom overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md sm:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      {/* Custom content for mobile */}
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-[101] sm:hidden",
            "flex flex-col",
            "bg-white"
          )}
        >
          {/* Header with search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shrink-0">
            <button
              onClick={() => onOpenChange(false)}
              className={cn(
                "p-2 -ml-2 rounded-full",
                "min-w-[44px] min-h-[44px] flex items-center justify-center",
                "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                "active:scale-95 transition-all"
              )}
              aria-label="Cerrar búsqueda"
            >
              <X size={20} />
            </button>

            <div className="flex-1 relative">
              <Search
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                  isFocused ? "text-brand-600" : "text-gray-400",
                  "size-[18px]"
                )}
              />
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Buscar por SKU o nombre..."
                className={cn(
                  "pl-10 pr-10 bg-gray-50 border-gray-200 focus-visible:ring-brand-600",
                  "rounded-full h-11 min-h-[44px] shadow-none",
                  "text-base",
                  "w-full"
                )}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2",
                    "p-1.5 rounded-full",
                    "min-w-[32px] min-h-[32px] flex items-center justify-center",
                    "text-gray-400 hover:text-gray-600 hover:bg-gray-200",
                    "transition-all"
                  )}
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto bg-white">
            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-600">Cargando productos...</p>
              </div>
            )}

            {/* Recent searches */}
            {!loading && showRecent && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Búsquedas recientes
                  </h3>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSearchChange(item.name)
                      }}
                      className={cn(
                        "w-full flex items-center justify-between",
                        "px-3 py-3 rounded-lg",
                        "hover:bg-gray-50 active:bg-gray-100",
                        "transition-colors text-left"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Package size={18} className="text-gray-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">{item.sku}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search results */}
            {showResults && (
              <div className="p-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    {filteredProducts.length} resultado{filteredProducts.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className={cn(
                          "w-full flex items-center gap-3",
                          "px-4 py-3 rounded-xl border border-gray-100",
                          "hover:border-brand-200 hover:bg-brand-50",
                          "active:scale-[0.99]",
                          "transition-all text-left"
                        )}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 shrink-0">
                          <Package size={18} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            SKU: {product.sku}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-gray-500">Stock</p>
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              product.stock > 10
                                ? "text-green-600"
                                : product.stock > 0
                                ? "text-amber-600"
                                : "text-red-600"
                            )}
                          >
                            {product.stock}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Search size={24} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      No se encontraron resultados
                    </p>
                    <p className="text-sm text-gray-500 text-center">
                      Intenta buscar con otro término o revisa la ortografía
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Empty state - no search, no recent searches, not loading */}
            {!loading && !showRecent && !showResults && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center mb-4">
                  <Search size={32} className="text-brand-600" />
                </div>
                <p className="text-base font-semibold text-gray-900 mb-1">
                  Buscar productos
                </p>
                <p className="text-sm text-gray-500 text-center max-w-[240px]">
                  Busca por nombre del producto o código SKU
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Dialog>
  )
}
