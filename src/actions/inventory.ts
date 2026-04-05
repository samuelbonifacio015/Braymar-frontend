"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase"
import type { Product } from "@/types/inventory"
import { getStockStatus } from "@/lib/inventory"

async function mapRow(row: Record<string, unknown>): Promise<Product> {
  const cat = (row.categories as Record<string, unknown> | null) ?? {}
  return {
    id: row.id as string,
    sku: row.sku as string,
    name: row.name as string,
    stock: row.stock as number,
    stockStatus: row.stock_status as Product["stockStatus"],
    location: row.location as Product["location"],
    unitPrice: Number(row.unit_price),
    wholesalePrice: Number(row.wholesale_price),
    categoryId: row.category_id as string,
    category: (cat.name as string) ?? "",
    imageUrl: row.image_url as string ?? undefined,
    unitsPerBox: row.units_per_box ? Number(row.units_per_box) : undefined,
  }
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, name)")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Failed to fetch products:", (error as { message?: string }).message)
    return []
  }
  return data ? await Promise.all(data.map(mapRow)) : []
}

export async function addProduct(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = (formData.get("name") as string)?.trim()
  const sku = (formData.get("sku") as string)?.trim()
  const categoryId = (formData.get("categoryId") as string)?.trim()
  const location = formData.get("location") as string
  const stock = parseInt(formData.get("stock") as string) || 0
  const unitPrice = parseFloat(formData.get("unitPrice") as string) || 0
  const wholesalePrice = parseFloat(formData.get("wholesalePrice") as string) || unitPrice * 0.85
  const unitsPerBox = parseInt(formData.get("unitsPerBox") as string) || undefined
  const imageFile = formData.get("image") as File | null

  if (!name) return { success: false, error: "El nombre es requerido" }
  if (!categoryId) return { success: false, error: "La categoría es requerida" }
  if (!location) return { success: false, error: "La ubicación es requerida" }

  const supabase = await createSupabaseServerClient()

  // Fetch category name for denormalized column + SKU generation
  const { data: catData } = await supabase.from("categories").select("name").eq("id", categoryId).single()
  if (!catData) return { success: false, error: "Categoría no encontrada" }

  const categoryName = catData.name as string
  const finalSku = sku || `${categoryName.substring(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`
  const stockStatus = getStockStatus(stock)

  let imageUrl: string | undefined

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from("products-images")
      .upload(path, imageFile, { contentType: imageFile.type })

    if (uploadError) return { success: false, error: `Error al subir imagen: ${(uploadError as { message?: string }).message}` }

    const { data: urlData } = supabase.storage.from("products-images").getPublicUrl(path)
    imageUrl = urlData.publicUrl
  }

  const { error } = await supabase.from("products").insert({
    sku: finalSku,
    name,
    stock,
    stock_status: stockStatus,
    location,
    unit_price: unitPrice,
    wholesale_price: wholesalePrice,
    category_id: categoryId,
    category: categoryName,
    image_url: imageUrl,
    units_per_box: unitsPerBox,
  })

  if (error) return { success: false, error: (error as { message?: string }).message }
  revalidatePath("/inventario")
  return { success: true }
}

export async function updateProduct(
  id: string,
  updates: {
    name?: string; categoryId?: string; location?: string; stock?: number;
    unitPrice?: number; wholesalePrice?: number; imageUrl?: string;
    unitsPerBox?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  const stockStatus = updates.stock !== undefined ? getStockStatus(updates.stock) : undefined

  const db: Record<string, unknown> = {
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.location !== undefined && { location: updates.location }),
    ...(updates.stock !== undefined && { stock: updates.stock }),
    ...(stockStatus && { stock_status: stockStatus }),
    ...(updates.unitPrice !== undefined && { unit_price: updates.unitPrice }),
    ...(updates.wholesalePrice !== undefined && { wholesale_price: updates.wholesalePrice }),
    ...(updates.imageUrl !== undefined && { image_url: updates.imageUrl }),
    ...(updates.unitsPerBox !== undefined && { units_per_box: updates.unitsPerBox }),
    updated_at: new Date().toISOString(),
  }

  if (updates.categoryId !== undefined) {
    const supabase = await createSupabaseServerClient()
    const { data: catData } = await supabase.from("categories").select("name").eq("id", updates.categoryId).single()
    if (catData) {
      db.category_id = updates.categoryId
      db.category = catData.name
    }
  }

  if (Object.keys(db).length === 0) return { success: true }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("products").update(db).eq("id", id)

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
