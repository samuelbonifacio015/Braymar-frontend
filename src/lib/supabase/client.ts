import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isValid = (v: string | undefined) => v && /^https?:\/\/.+/.test(v)

let cachedClient: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!isValid(url)) throw new Error("Supabase URL is not configured. Set NEXT_PUBLIC_SUPABASE_URL in .env.local")
  if (!cachedClient) cachedClient = createClient(url, key)
  return cachedClient
}

export const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      return getClient()[prop as keyof SupabaseClient]
    }
  }
) as unknown as SupabaseClient
