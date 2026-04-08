export interface StoreSettings {
  storeName: string
  ruc: string
  address: string
  phone: string
  currency: string
}

export interface StockThreshold {
  global: number
}

export interface AppearancePreferences {
  density: "compact" | "default" | "comfortable"
  sidebarCollapsed: boolean
  animationsEnabled: boolean
}

export interface NotificationPreferences {
  lowStockAlerts: boolean
  transferAlerts: boolean
  salesSummary: boolean
  emailNotifications: boolean
  soundEnabled: boolean
}

export interface ProfileInfo {
  name: string
  email: string
  role: string
  avatarUrl: string
}

export interface UserPreferences {
  store: StoreSettings
  threshold: StockThreshold
  appearance: AppearancePreferences
  notifications: NotificationPreferences
  profile: ProfileInfo
}

export type SettingsSection =
  | "general"
  | "inventario"
  | "apariencia"
  | "notificaciones"
  | "perfil"
  | "seguridad"
