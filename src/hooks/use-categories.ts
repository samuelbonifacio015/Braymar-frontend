import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Category } from "@/types/inventory"

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    color: (row.color as string) || "slate",
    icon: row.icon as string ?? "",
    description: (row.description as string) || "",
    createdAt: row.created_at as string,
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true })
    if (!error && data) setCategories(data.map(mapCategory))
  }, [])

  useEffect(() => {
    setLoading(true)
    refresh().then(() => setLoading(false))
  }, [refresh])

  return { categories, loading, refresh, setCategories }
}
