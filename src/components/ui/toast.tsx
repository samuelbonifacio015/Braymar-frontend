"use client"

import { useState, useEffect, useCallback } from "react"
import { CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastState {
  message: string
  type: "success" | "error" | "info"
  visible: boolean
}

let toastListener: ((toast: Omit<ToastState, "visible">) => void) | null = null

/** Disparar un toast desde cualquier lugar del app */
export function showToast(message: string, type: "success" | "error" | "info" = "success") {
  toastListener?.({ message, type })
}

export function ToastProvider() {
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    toastListener = ({ message, type }) => {
      setToast({ message, type, visible: true })
    }
    return () => {
      toastListener = null
    }
  }, [])

  // Auto-dismiss en 2.5s
  useEffect(() => {
    if (!toast?.visible) return
    const timer = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null))
    }, 2500)
    return () => clearTimeout(timer)
  }, [toast?.visible, toast?.message])

  // Limpiar toast al terminar la animación de salida
  useEffect(() => {
    if (toast && !toast.visible) {
      const timer = setTimeout(() => setToast(null), 300)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleDismiss = useCallback(() => {
    setToast((prev) => (prev ? { ...prev, visible: false } : null))
  }, [])

  if (!toast) return null

  const iconMap = {
    success: <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />,
    error: <X size={16} className="text-red-500 shrink-0" />,
    info: <CheckCircle2 size={16} className="text-brand-600 shrink-0" />,
  }

  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-xl border border-border/60 bg-white px-4 py-3 shadow-lg shadow-black/5",
        "transition-all duration-300 ease-out",
        toast.visible
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0 pointer-events-none"
      )}
    >
      {iconMap[toast.type]}
      <span className="text-sm font-medium text-foreground">{toast.message}</span>
      <button
        onClick={handleDismiss}
        className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Cerrar notificación"
      >
        <X size={14} />
      </button>
    </div>
  )
}
