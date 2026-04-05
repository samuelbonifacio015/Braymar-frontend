export type ProviderStatus = "activo" | "inactivo" | "en_revision"

export type ReliabilityLevel = "excelente" | "muy_bueno" | "bueno" | "regular" | "deficiente"

export interface Provider {
  id: string
  ruc: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  status: ProviderStatus
  reliability: ReliabilityLevel
  reliabilityScore: number
  onTimeRate: number
  deliveryDays: number
  productIds: string[]
  notes: string
  since: string
  avatarColor: string
}
