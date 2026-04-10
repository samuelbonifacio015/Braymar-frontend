"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase"
import type { Alert } from "@/types/alerts"
import { generateAlerts } from "@/lib/alerts"
import { getProducts } from "@/actions/inventory"

// Map database row to Alert type
function mapAlertRow(row: Record<string, unknown>): Alert {
  return {
    id: row.id as string,
    type: row.type as Alert["type"],
    severity: row.severity as Alert["severity"],
    message: row.message as string,
    productIds: (row.product_ids as string[]) || [],
    providerIds: (row.provider_ids as string[]) || [],
    productId: (row.product_ids as string[])?.[0],
    providerId: (row.provider_ids as string[])?.[0],
    resolved: !!row.resolved_at,
    resolvedAt: row.resolved_at as string,
    createdAt: row.created_at as string,
  }
}

// Get all alerts from database
export async function getAlerts(includeResolved: boolean = false): Promise<Alert[]> {
  const supabase = await createSupabaseServerClient()
  
  let query = supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })

  if (!includeResolved) {
    query = query.is("resolved_at", null)
  }

  const { data, error } = await query

  if (error) {
    console.error("Failed to fetch alerts:", (error as { message?: string }).message)
    return []
  }

  return data ? data.map(mapAlertRow) : []
}

// Create a single alert in database
export async function createAlert(alert: {
  id: string
  type: Alert["type"]
  severity: Alert["severity"]
  message: string
  productIds?: string[]
  providerIds?: string[]
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("alerts").insert({
    id: alert.id,
    type: alert.type,
    severity: alert.severity,
    message: alert.message,
    product_ids: alert.productIds || [],
    provider_ids: alert.providerIds || [],
    created_at: new Date().toISOString(),
  })

  if (error) {
    return { success: false, error: (error as { message?: string }).message }
  }

  revalidatePath("/alertas")
  return { success: true }
}

// Resolve an alert
export async function resolveAlert(alertId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("alerts")
    .update({
      resolved_at: new Date().toISOString(),
    })
    .eq("id", alertId)

  if (error) {
    return { success: false, error: (error as { message?: string }).message }
  }

  revalidatePath("/alertas")
  return { success: true }
}

// Delete an alert
export async function deleteAlert(alertId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("alerts")
    .delete()
    .eq("id", alertId)

  if (error) {
    return { success: false, error: (error as { message?: string }).message }
  }

  revalidatePath("/alertas")
  return { success: true }
}

// Sync alerts with current product and provider state
// This function checks all products and providers and creates/updates alerts accordingly
export async function syncAlerts(): Promise<{ success: boolean; created?: number; removed?: number }> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Get current products
    const products = await getProducts()
    
    // Get providers from database
    const { data: providersData } = await supabase
      .from("providers")
      .select("*")
    
    if (!providersData) {
      return { success: false }
    }

    // Generate alerts using raw provider data
    const currentAlerts = generateAlerts(products, providersData as any)

    // Get existing unresolved alerts from database
    const { data: existingAlerts } = await supabase
      .from("alerts")
      .select("id, product_ids, provider_ids, type, severity, message")
      .is("resolved_at", null)

    const existingAlertIds = new Set(existingAlerts?.map((a: Record<string, unknown>) => a.id as string) || [])
    const currentAlertIds = new Set(currentAlerts.map(a => a.id))

    // Create new alerts that don't exist in database
    let createdCount = 0
    for (const alert of currentAlerts) {
      if (!existingAlertIds.has(alert.id)) {
        await createAlert({
          id: alert.id,
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          productIds: alert.productIds,
          providerIds: alert.providerIds,
        })
        createdCount++
      }
    }

    // Mark alerts as resolved that are no longer in current alerts
    let removedCount = 0
    if (existingAlerts) {
      for (const existingAlert of existingAlerts) {
        if (!currentAlertIds.has(existingAlert.id as string)) {
          await supabase
            .from("alerts")
            .update({
              resolved_at: new Date().toISOString(),
            })
            .eq("id", existingAlert.id)
          removedCount++
        }
      }
    }

    revalidatePath("/alertas")
    return { success: true, created: createdCount, removed: removedCount }
  } catch (error) {
    console.error("Error syncing alerts:", error)
    return { success: false }
  }
}
