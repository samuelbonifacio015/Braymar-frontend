"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { UserPreferences } from "@/types/settings"
import { defaultPreferences } from "@/data/mock-settings"
import { showToast } from "@/components/ui/toast"

const STORAGE_KEY = "braymar-preferences"

function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") return defaultPreferences
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultPreferences
    const parsed = JSON.parse(stored) as Partial<UserPreferences>
    // Merge profundo con defaults para manejar nuevos campos
    return {
      store: { ...defaultPreferences.store, ...parsed.store },
      threshold: { ...defaultPreferences.threshold, ...parsed.threshold },
      appearance: { ...defaultPreferences.appearance, ...parsed.appearance },
      notifications: { ...defaultPreferences.notifications, ...parsed.notifications },
      profile: { ...defaultPreferences.profile, ...parsed.profile },
    }
  } catch {
    return defaultPreferences
  }
}

function savePreferences(prefs: UserPreferences) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // localStorage lleno u otra excepción
  }
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cargar al montar (solo client-side)
  useEffect(() => {
    setPreferences(loadPreferences())
    setIsLoaded(true)
  }, [])

  // Guardar con debounce de 300ms
  const persistPreferences = useCallback((updated: UserPreferences) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      savePreferences(updated)
      showToast("Configuración guardada", "success")
    }, 300)
  }, [])

  /** Actualizar una sección completa de preferencias */
  const updateSection = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setPreferences((prev) => {
        const updated = { ...prev, [key]: value }
        persistPreferences(updated)
        return updated
      })
    },
    [persistPreferences]
  )

  /** Actualizar un campo individual dentro de una sección */
  const updateField = useCallback(
    <K extends keyof UserPreferences>(
      section: K,
      field: keyof UserPreferences[K],
      value: UserPreferences[K][keyof UserPreferences[K]]
    ) => {
      setPreferences((prev) => {
        const updated = {
          ...prev,
          [section]: { ...prev[section], [field]: value },
        }
        persistPreferences(updated)
        return updated
      })
    },
    [persistPreferences]
  )

  /** Resetear a valores por defecto */
  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences)
    savePreferences(defaultPreferences)
    showToast("Configuración restablecida", "info")
  }, [])

  return {
    preferences,
    isLoaded,
    updateSection,
    updateField,
    resetPreferences,
  }
}
