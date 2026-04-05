import { Category } from "@/types/inventory"

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Cuadernos",
    slug: "cuadernos",
    color: "blue",
    icon: "BookOpen",
    description: "Cuadernos espiralados, cosidos y libretas",
    createdAt: "2024-01-15",
  },
  {
    id: "cat-2",
    name: "Escritura",
    slug: "escritura",
    color: "amber",
    icon: "Pen",
    description: "Lapiceros, lapices y utensilios de escritura",
    createdAt: "2024-01-15",
  },
  {
    id: "cat-3",
    name: "Mochilas",
    slug: "mochilas",
    color: "emerald",
    icon: "Backpack",
    description: "Mochilas escolares y urbanas",
    createdAt: "2024-01-15",
  },
  {
    id: "cat-4",
    name: "Utiles de Escritorio",
    slug: "utiles-escritorio",
    color: "violet",
    icon: "Pencil",
    description: "Borradores, reglas, tijeras y similares",
    createdAt: "2024-01-15",
  },
  {
    id: "cat-5",
    name: "Manualidades",
    slug: "manualidades",
    color: "pink",
    icon: "Palette",
    description: "Materiales para proyectos creativos y artesanales",
    createdAt: "2024-02-01",
  },
  {
    id: "cat-6",
    name: "Arte",
    slug: "arte",
    color: "rose",
    icon: "Paintbrush",
    description: "Lienzos, pinturas y materiales de arte",
    createdAt: "2024-02-01",
  },
  {
    id: "cat-7",
    name: "Oficina",
    slug: "oficina",
    color: "slate",
    icon: "Briefcase",
    description: "Articulos y organizacion de oficina",
    createdAt: "2024-02-01",
  },
]

export const getCategories = () => [...CATEGORIES]

export const addCategory = (cat: Omit<Category, "id" | "createdAt">) => {
  CATEGORIES.push({ ...cat, id: `cat-${Date.now()}`, createdAt: new Date().toISOString() })
  return { success: true }
}

export const updateCategory = (id: string, data: Partial<Category>) => {
  const idx = CATEGORIES.findIndex((c) => c.id === id)
  if (idx === -1) return { success: false, error: "Categoria no encontrada" }
  CATEGORIES[idx] = { ...CATEGORIES[idx], ...data }
  return { success: true }
}

export const deleteCategory = (id: string) => {
  const idx = CATEGORIES.findIndex((c) => c.id === id)
  if (idx === -1) return { success: false, error: "Categoria no encontrada" }
  CATEGORIES.splice(idx, 1)
  return { success: true }
}
