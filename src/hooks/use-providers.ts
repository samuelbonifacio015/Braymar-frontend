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
      const formatted = data?.map(p => ({
        id: p.id,
        ruc: p.ruc,
        name: p.name,
        contactPerson: p.contact_person,
        phone: p.phone,
        email: p.email,
        address: p.address,
        status: p.status,
        reliability: p.reliability,
        reliabilityScore: p.reliability_score,
        onTimeRate: p.on_time_rate,
        deliveryDays: p.delivery_days,
        productIds: p.product_ids || [], // Default to empty array if null
        notes: p.notes,
        since: p.since,
        avatarColor: p.avatar_color
      })) as Provider[]
      setProviders(formatted || [])
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
