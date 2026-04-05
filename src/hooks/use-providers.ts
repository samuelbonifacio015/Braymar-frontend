import { useState, useEffect, useCallback } from "react"
import { getProviders } from "@/data/mock-providers"
import type { Provider } from "@/types/providers"

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 300))
    setProviders(getProviders())
  }, [])

  useEffect(() => {
    setLoading(true)
    refresh().then(() => setLoading(false))
  }, [])

  return { providers, loading, refresh, setProviders }
}
