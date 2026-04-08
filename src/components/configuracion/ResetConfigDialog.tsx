"use client"

import { AlertTriangle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface ResetConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ResetConfigDialog({ open, onOpenChange, onConfirm }: ResetConfigDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={18} />
            Restablecer configuración
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas restablecer toda la configuración a los valores por defecto?
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-700 font-medium mb-2">Esto incluye:</p>
            <ul className="text-xs text-red-600 space-y-1">
              <li>• Datos de la tienda</li>
              <li>• Umbrales de stock</li>
              <li>• Preferencias de apariencia</li>
              <li>• Configuración de notificaciones</li>
              <li>• Datos de perfil local</li>
            </ul>
            <p className="text-xs text-red-500 mt-3 font-medium">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            <RotateCcw size={14} className="mr-1.5" />
            Sí, restablecer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
