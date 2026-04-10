"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase"
import type { Sale, SaleItem } from "@/types/sales"

// Map database row to Sale type
function mapSaleRow(row: Record<string, unknown>): Sale {
  return {
    id: row.id as string,
    total: Number(row.total),
    itemCount: row.item_count as number,
    paymentMethod: row.payment_method as Sale["paymentMethod"],
    saleBy: (row.sale_by as string) ?? "vendedor",
    createdAt: row.created_at as string,
  }
}

// Get all sales with optional date range filter
export async function getSales(dateFrom?: string, dateTo?: string): Promise<Sale[]> {
  const supabase = await createSupabaseServerClient()
  
  let query = supabase
    .from("sales")
    .select("*")
    .order("created_at", { ascending: false })

  if (dateFrom) {
    query = query.gte("created_at", dateFrom)
  }
  if (dateTo) {
    query = query.lte("created_at", dateTo)
  }

  const { data, error } = await query

  if (error) {
    console.error("Failed to fetch sales:", (error as { message?: string }).message)
    return []
  }

  return data ? data.map(mapSaleRow) : []
}

// Get sales items for a specific sale
export async function getSaleItems(saleId: string): Promise<SaleItem[]> {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("sale_items")
    .select("*")
    .eq("sale_id", saleId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Failed to fetch sale items:", (error as { message?: string }).message)
    return []
  }

  return data ? data.map((item) => ({
    productId: item.product_id as string,
    productName: item.product_name as string,
    sku: item.sku as string,
    quantity: item.quantity as number,
    unitPrice: Number(item.unit_price),
    total: Number(item.total),
  })) : []
}

// Create a sale with all its items, update stock, and create movement records
export async function createSale(
  saleData: {
    items: Array<{
      productId: string
      productName: string
      sku: string
      quantity: number
      unitPrice: number
      total: number
    }>
    total: number
    paymentMethod: "efectivo" | "yape_plin" | "tarjeta"
    saleBy?: string
  }
): Promise<{ success: boolean; error?: string; saleId?: string }> {
  const supabase = await createSupabaseServerClient()

  try {
    // Generate unique sale ID
    const saleId = `sale-${Date.now()}`
    const itemCount = saleData.items.length
    const saleBy = saleData.saleBy ?? "vendedor"
    const createdAt = new Date().toISOString()

    // 1. Insert sale record
    const { error: saleError } = await supabase.from("sales").insert({
      id: saleId,
      total: saleData.total,
      item_count: itemCount,
      payment_method: saleData.paymentMethod,
      sale_by: saleBy,
      created_at: createdAt,
    })

    if (saleError) {
      return { success: false, error: `Error al crear venta: ${(saleError as { message?: string }).message}` }
    }

    // 2. Insert sale items and update stock + create movements
    const movementRecords = []
    
    for (const item of saleData.items) {
      // Insert sale item
      const { error: itemError } = await supabase.from("sale_items").insert({
        sale_id: saleId,
        product_id: item.productId,
        product_name: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total: item.total,
        created_at: createdAt,
      })

      if (itemError) {
        console.error("Error inserting sale item:", itemError)
        // Continue with other items even if one fails
      }

      // 3. Update product stock
      const { data: productData, error: fetchError } = await supabase
        .from("products")
        .select("stock, location, stock_status")
        .eq("id", item.productId)
        .single()

      if (!fetchError && productData) {
        const newStock = Math.max(0, (productData.stock as number) - item.quantity)
        
        // Calculate new stock status
        let newStockStatus = "optimo"
        if (newStock === 0) {
          newStockStatus = "agotado"
        } else if (newStock <= 20) {
          newStockStatus = "bajo_stock"
        }

        const { error: updateError } = await supabase
          .from("products")
          .update({
            stock: newStock,
            stock_status: newStockStatus,
            updated_at: createdAt,
          })
          .eq("id", item.productId)

        if (updateError) {
          console.error("Error updating product stock:", updateError)
        }

        // 4. Create movement record for stock salida
        movementRecords.push({
          id: `mov-${Date.now()}-${item.productId}`,
          product_id: item.productId,
          product_name: item.productName,
          sku: item.sku,
          type: "salida",
          quantity: item.quantity,
          from_location: productData.location,
          notes: `Venta ${saleId} - ${saleData.paymentMethod}`,
          performed_by: saleBy,
          created_at: createdAt,
        })
      }
    }

    // 5. Insert all movement records
    if (movementRecords.length > 0) {
      const { error: movementsError } = await supabase
        .from("movements")
        .insert(movementRecords)

      if (movementsError) {
        console.error("Error creating movement records:", movementsError)
        // Don't fail the sale if movements fail - stock was already updated
      }
    }

    // Revalidate paths to refresh data
    revalidatePath("/ventas")
    revalidatePath("/historial")
    revalidatePath("/inventario")

    return { success: true, saleId }
  } catch (error) {
    console.error("Error creating sale:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al crear venta" 
    }
  }
}

// Get today's sales stats
export async function getTodaySalesStats(): Promise<{
  totalRevenue: number
  transactionCount: number
  averageTicket: number
}> {
  const supabase = await createSupabaseServerClient()
  
  // Get today's date range
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()

  const { data, error } = await supabase
    .from("sales")
    .select("total, item_count")
    .gte("created_at", startOfDay)
    .lt("created_at", endOfDay)

  if (error) {
    console.error("Failed to fetch today's sales:", (error as { message?: string }).message)
    return { totalRevenue: 0, transactionCount: 0, averageTicket: 0 }
  }

  const totalRevenue = data?.reduce((sum, sale) => sum + Number(sale.total), 0) ?? 0
  const transactionCount = data?.length ?? 0
  const averageTicket = transactionCount > 0 ? totalRevenue / transactionCount : 0

  return { totalRevenue, transactionCount, averageTicket }
}
