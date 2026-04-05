export type AlertSeverity = "urgente" | "advertencia" | "informativo"
export type AlertType = "out_of_stock" | "low_stock" | "inactive_provider" | "uncategorized"

export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  message: string
  productIds?: string[]
  providerIds?: string[]
  createdAt: string
  resolvedAt?: string
}
