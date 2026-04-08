import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Provider } from "@/types/providers"

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('providers').select('*').order('name')
      if (error) {
        console.error("Error fetching providers:", error)
        return
      }
      setProviders(data as Provider[] || [])
    } catch (err) {
      console.error("Failed to fetch providers:", err)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    refresh().finally(() => setLoading(false))
  }, [refresh])

  return { providers, loading, refresh, setProviders }
}
