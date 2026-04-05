"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase"

export async function addCategory(
  name: string,
  slug: string,
  color: string,
  icon: string,
  description: string
): Promise<{ success: boolean; error?: string }> {
  if (!name.trim()) return { success: false, error: "El nombre es requerido" }
  if (!slug.trim()) return { success: false, error: "El slug es requerido" }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("categories").insert({
    name: name.trim(),
    slug: slug.trim(),
    color,
    icon,
    description: description.trim(),
  })

  if (error) return { success: false, error: (error as { message?: string }).message }
  revalidatePath("/categorias")
  revalidatePath("/inventario")
  return { success: true }
}

export async function updateCategory(
  id: string,
  updates: { name?: string; slug?: string; color?: string; icon?: string; description?: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from("categories")
    .update({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.slug !== undefined && { slug: updates.slug }),
      ...(updates.color !== undefined && { color: updates.color }),
      ...(updates.icon !== undefined && { icon: updates.icon }),
      ...(updates.description !== undefined && { description: updates.description }),
    })
    .eq("id", id)

  if (error) return { success: false, error: (error as { message?: string }).message }
  revalidatePath("/categorias")
  revalidatePath("/inventario")
  return { success: true }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) return { success: false, error: (error as { message?: string }).message }
  revalidatePath("/categorias")
  revalidatePath("/inventario")
  return { success: true }
}
