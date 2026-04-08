"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getColorClasses, getCategoryIcon, COLOR_OPTIONS } from "@/lib/categories"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/inventory"
import * as icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

const ICON_OPTIONS = ["BookOpen", "Pen", "Backpack", "Pencil", "Palette", "Paintbrush", "Briefcase", "Package", "Box", "NotebookPen", "PenLine", "Marker", "Highlighter", "Eraser", "Scissors", "Files", "Clipboard", "ShoppingBag", "FileText", "TableProperties", "Ruler", "Brush", "Glasses", "Stethoscope", "Wrench", "Monitor", "Laptop", "Printer", "FolderOpen"]

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSave: (data: Omit<Category, "id" | "createdAt">) => void
}

export function CategoryDialog({ open, onOpenChange, category, onSave }: CategoryDialogProps) {
  const isEditing = category !== null
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState("blue")
  const [selectedIcon, setSelectedIcon] = useState("BookOpen")

  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description)
      setSelectedColor(category.color)
      setSelectedIcon(category.icon)
    } else {
      setName("")
      setDescription("")
      setSelectedColor("blue")
      setSelectedIcon("BookOpen")
    }
  }, [category, open])

  const handleSave = () => {
    if (!name.trim()) return
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    onSave({
      name: name.trim(),
      slug,
      color: selectedColor,
      icon: selectedIcon,
      description,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Categoria" : "Nueva Categoria"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modifica los datos de la categoria." : "Crea una nueva categoria para organizar tus productos."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Nombre</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Cuadernos" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Descripcion</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripcion corta" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_OPTIONS.map((color) => {
                const c = getColorClasses(color)
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-8 h-8 rounded-full bg-gradient-to-br border-2 transition-all",
                      c.gradient,
                      selectedColor === color ? "ring-2 ring-offset-2 ring-brand-600 scale-110" : "border-transparent"
                    )}
                  />
                )
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Icono</label>
            <div className="flex items-center gap-1.5 flex-wrap max-h-32 overflow-y-auto">
              {ICON_OPTIONS.map((iconName) => {
                const Icon = (icons as any)[iconName] ?? null
                if (!Icon) return null
                const colors = getColorClasses(selectedColor)
                return (
                  <button
                    key={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center border transition-all",
                      selectedIcon === iconName
                        ? cn(colors.bg, colors.icon, colors.border)
                        : "border-transparent hover:bg-muted"
                    )}
                    title={iconName}
                  >
                    <Icon size={16} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", getColorClasses(selectedColor).bg)}>
              {(() => { const PreviewIcon = getCategoryIcon(selectedIcon); return PreviewIcon ? <PreviewIcon size={20} className={getColorClasses(selectedColor).icon} /> : null; })()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{name || "Nombre de la categoria"}</p>
              <p className="text-xs text-muted-foreground truncate">{description || "Descripcion"}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={handleSave} disabled={!name.trim()}>
            {isEditing ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
