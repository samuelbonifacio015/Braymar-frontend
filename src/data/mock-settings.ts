import type { StoreSettings, StockThreshold } from "@/types/settings"

export const mockStoreSettings: StoreSettings = {
  storeName: "Braymar Distribuciones",
  ruc: "20123456789",
  address: "Av. Grau 456, Miraflores, Lima",
  phone: "(01) 456-7890",
  currency: "PEN",
}

export const mockThreshold: StockThreshold = {
  global: 20,
}
