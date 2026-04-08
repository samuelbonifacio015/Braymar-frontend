import type { UserPreferences } from "@/types/settings"

export const defaultPreferences: UserPreferences = {
  store: {
    storeName: "Braymar Distribuciones",
    ruc: "20123456789",
    address: "Av. Grau 456, Miraflores, Lima",
    phone: "(01) 456-7890",
    currency: "PEN",
  },
  threshold: {
    global: 20,
  },
  appearance: {
    density: "default",
    sidebarCollapsed: false,
    animationsEnabled: true,
  },
  notifications: {
    lowStockAlerts: true,
    transferAlerts: true,
    salesSummary: false,
    emailNotifications: false,
    soundEnabled: true,
  },
  profile: {
    name: "Admin Braymar",
    email: "admin@braymar.com",
    role: "Administrador",
    avatarUrl: "",
  },
}

// Re-exportar para compatibilidad con los imports existentes
export const mockStoreSettings = defaultPreferences.store
export const mockThreshold = defaultPreferences.threshold
