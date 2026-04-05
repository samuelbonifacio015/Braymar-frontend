"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase"
import type { Product } from "@/types/inventory"
import { getStockStatus } from "@/lib/inventory"

async function mapRow(row: Record<string, unknown>): Promise<Product> {
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
  }
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Failed to fetch products:", (error as { message?: string }).message)
    return []
  }
  return data ? await Promise.all(data.map(mapRow)) : []
}

export async function addProduct(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = (formData.get("name") as string)?.trim()
  const category = (formData.get("category") as string)?.trim()
  const location = formData.get("location") as string
  const stock = parseInt(formData.get("stock") as string) || 0
  const unitPrice = parseFloat(formData.get("unitPrice") as string) || 0

  if (!name) return { success: false, error: "El nombre es requerido" }
  if (!category) return { success: false, error: "La categoría es requerida" }
  if (!location) return { success: false, error: "La ubicación es requerida" }

  const sku = `${category.substring(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`
  const stockStatus = getStockStatus(stock)

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("products").insert({
    sku,
    name,
    stock,
    stock_status: stockStatus,
    location,
    unit_price: unitPrice,
    wholesale_price: unitPrice * 0.85,
    category,
  })

  if (error) return { success: false, error: (error as { message?: string }).message }
  revalidatePath("/inventario")
  return { success: true }
}

export async function updateProduct(
  id: string,
  updates: Partial<Pick<Product, "name" | "category" | "location" | "stock" | "unitPrice">>
): Promise<{ success: boolean; error?: string }> {
  const stockStatus = updates.stock !== undefined ? getStockStatus(updates.stock) : undefined

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from("products")
    .update({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.location !== undefined && { location: updates.location }),
      ...(updates.stock !== undefined && { stock: updates.stock }),
      ...(stockStatus && { stock_status: stockStatus }),
      ...(updates.unitPrice !== undefined && { unit_price: updates.unitPrice }),
      ...(updates.unitPrice !== undefined && { wholesale_price: updates.unitPrice * 0.85 }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) return { success: false, error: (error as { message?: string }).message }
  revalidatePath("/inventario")
  return { success: true }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) return { success: false, error: (error as { message?: string }).message }
  revalidatePath("/inventario")
  return { success: true }
}
