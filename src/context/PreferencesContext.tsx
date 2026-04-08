"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
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

interface PreferencesContextValue {
  preferences: UserPreferences
  isLoaded: boolean
  updateSection: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void
  updateField: <K extends keyof UserPreferences>(
    section: K,
    field: keyof UserPreferences[K],
    value: UserPreferences[K][keyof UserPreferences[K]]
  ) => void
  resetPreferences: () => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cargar al montar
  useEffect(() => {
    setPreferences(loadPreferences())
    setIsLoaded(true)
  }, [])

  // Aplicar efectos de apariencia al documento
  useEffect(() => {
    if (!isLoaded) return
    const root = document.documentElement

    // Densidad
    root.dataset.density = preferences.appearance.density

    // Animaciones
    if (preferences.appearance.animationsEnabled) {
      root.classList.remove("no-animations")
    } else {
      root.classList.add("no-animations")
    }
  }, [isLoaded, preferences.appearance.density, preferences.appearance.animationsEnabled])

  // Guardar con debounce
  const persistPreferences = useCallback((updated: UserPreferences) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      savePreferences(updated)
      showToast("Configuración guardada", "success")
    }, 300)
  }, [])

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

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences)
    savePreferences(defaultPreferences)
    showToast("Configuración restablecida", "info")
  }, [])

  return (
    <PreferencesContext.Provider
      value={{ preferences, isLoaded, updateSection, updateField, resetPreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function useGlobalPreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error("useGlobalPreferences debe usarse dentro de PreferencesProvider")
  }
  return context
}
