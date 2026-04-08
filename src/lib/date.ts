/**
 * Relative date helpers for movement history display.
 * Converts ISO dates to human-readable strings like "Hace 2h", "Ayer", "05 abr".
 */

export function isToday(isoDate: string): boolean {
  const date = new Date(isoDate)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export function isYesterday(isoDate: string): boolean {
  const date = new Date(isoDate)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  )
}

/**
 * Format an ISO date to a relative, human-readable string.
 * - Within today: "Hace 2h"
 * - Yesterday: "Ayer"
 * - This week: "Lun", "Mar", etc.
 * - Older: "05 abr 2026"
 */
export function formatRelativeDate(isoDate: string): string {
  if (isToday(isoDate)) {
    const now = new Date()
    const diffMs = now.getTime() - new Date(isoDate).getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) {
      const diffMin = Math.floor(diffMs / (1000 * 60))
      return `Hace ${diffMin}min`
    }
    return `Hace ${diffHours}h`
  }

  if (isYesterday(isoDate)) {
    return "Ayer"
  }

  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffDays < 7) {
    return date.toLocaleDateString("es-PE", { weekday: "short" })
  }

  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

/**
 * Format full date + time for detailed view.
 */
export function formatFullDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(/[\u202f\u00a0]/g, ' ')
}
