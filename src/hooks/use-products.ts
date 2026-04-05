import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Product } from "@/types/inventory"

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    sku: row.sku as string,
    name: row.name as string,
    stock: row.stock as number,
    stockStatus: row.stock_status as Product["stockStatus"],
    location: row.location as Product["location"],
    unitPrice: Number(row.unit_price),
    wholesalePrice: Number(row.wholesale_price),
    category: row.category as string,
    imageUrl: row.image_url as string ?? undefined,
    unitsPerBox: row.units_per_box ? Number(row.units_per_box) : undefined,
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error && data) setProducts(data.map(mapRow))
  }, [])

  useEffect(() => {
    setLoading(true)
    refresh().then(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { products, loading, refresh }
}
