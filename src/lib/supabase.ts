import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

let cachedClient: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!cachedClient) cachedClient = createClient(url, key)
  return cachedClient
}

export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  return getClient()
}
