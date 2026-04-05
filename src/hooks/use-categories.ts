import { useState, useEffect, useCallback } from "react"
import { getCategories } from "@/data/mock-categories"
import type { Category } from "@/types/inventory"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 300))
    setCategories(getCategories())
  }, [])

  useEffect(() => {
    setLoading(true)
    refresh().then(() => setLoading(false))
  }, [])

  return { categories, loading, refresh, setCategories }
}
