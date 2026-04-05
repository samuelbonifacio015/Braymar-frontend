import type { Provider } from "@/types/providers"

let providers: Provider[] = [
  {
    id: "prov-1",
    ruc: "20100456789",
    name: "Distribuidora San Isidro S.A.C.",
    contactPerson: "Carlos Mendoza",
    phone: "+51 999 888 777",
    email: "ventas@dsi.pe",
    address: "Av. La Molina 1234, Lima",
    status: "activo" as const,
    reliability: "excelente" as const,
    reliabilityScore: 4.8,
    onTimeRate: 96,
    deliveryDays: 3,
    productIds: ["prod-1", "prod-6"],
    notes: "Proveedor principal de cuadernos",
    since: "2019-03-15",
    avatarColor: "var(--brand-600)",
  },
  {
    id: "prov-2",
    ruc: "20200123456",
    name: "Papelera del Sur E.I.R.L.",
    contactPerson: "Maria Quispe",
    phone: "+51 987 654 321",
    email: "contacto@papelerasur.com.pe",
    address: "Calle Arequipa 567, Cusco",
    status: "activo" as const,
    reliability: "muy_bueno" as const,
    reliabilityScore: 4.2,
    onTimeRate: 88,
    deliveryDays: 5,
    productIds: ["prod-5", "prod-2"],
    notes: "Especializado en articulos de papel y manualidades",
    since: "2020-06-01",
    avatarColor: "#059669",
  },
  {
    id: "prov-3",
    ruc: "20600789012",
    name: "Importadora Hua Xin",
    contactPerson: "Wei Zhang",
    phone: "+51 912 345 678",
    email: "pedidos@huaxin.pe",
    address: "Jr. Andahuaylas 890, Lima",
    status: "activo" as const,
    reliability: "regular" as const,
    reliabilityScore: 2.8,
    onTimeRate: 62,
    deliveryDays: 14,
    productIds: ["prod-3"],
    notes: "Importador de mochilas y articulos de arte",
    since: "2021-01-20",
    avatarColor: "#d97706",
  },
  {
    id: "prov-4",
    ruc: "20300654321",
    name: "Grafica Universal S.A.C.",
    contactPerson: "Ana Rodriguez",
    phone: "+51 945 678 123",
    email: "info@graficauniversal.pe",
    address: "Av. Industrial 2345, Callao",
    status: "activo" as const,
    reliability: "bueno" as const,
    reliabilityScore: 3.5,
    onTimeRate: 78,
    deliveryDays: 7,
    productIds: ["prod-7"],
    notes: "Materiales de arte y lienzos",
    since: "2022-04-10",
    avatarColor: "#e11d48",
  },
  {
    id: "prov-5",
    ruc: "20400112233",
    name: "Oficor Distribuciones E.I.R.L.",
    contactPerson: "Jorge Vargas",
    phone: "+51 933 456 789",
    email: "ventas@oficor.pe",
    address: "Calle Los Olivos 678, San Luis",
    status: "activo" as const,
    reliability: "muy_bueno" as const,
    reliabilityScore: 4.0,
    onTimeRate: 85,
    deliveryDays: 4,
    productIds: ["prod-8", "prod-4"],
    notes: "Articulos de oficina y escritorio",
    since: "2020-11-05",
    avatarColor: "#6d28d9",
  },
  {
    id: "prov-6",
    ruc: "20500998877",
    name: "Textiles Andinos S.A.",
    contactPerson: "Rosa Condori",
    phone: "+51 966 789 012",
    email: "export@textilesandinos.pe",
    address: "Av. Puno 432, Juliaca",
    status: "en_revision" as const,
    reliability: "bueno" as const,
    reliabilityScore: 3.2,
    onTimeRate: 75,
    deliveryDays: 8,
    productIds: [],
    notes: "Proveedor de mochilas - en revision de calidad",
    since: "2021-08-22",
    avatarColor: "#7c3aed",
  },
  {
    id: "prov-7",
    ruc: "20700555444",
    name: "Papelmart Peru S.A.C.",
    contactPerson: "Diego Fernandez",
    phone: "+51 922 111 333",
    email: "soporte@papelmart.pe",
    address: "Parque Industrial 100, Arequipa",
    status: "activo" as const,
    reliability: "excelente" as const,
    reliabilityScore: 4.6,
    onTimeRate: 94,
    deliveryDays: 2,
    productIds: ["prod-1", "prod-8", "prod-4"],
    notes: "Suministro rapido de papel y oficina",
    since: "2023-01-15",
    avatarColor: "#2563eb",
  },
  {
    id: "prov-8",
    ruc: "20100333222",
    name: "Color y Forma S.R.L.",
    contactPerson: "Patricia Luna",
    phone: "+51 955 222 444",
    email: "pedidos@coloryforma.pe",
    address: "Jr. Huaraz 321, Breña",
    status: "inactivo" as const,
    reliability: "deficiente" as const,
    reliabilityScore: 1.5,
    onTimeRate: 35,
    deliveryDays: 21,
    productIds: [],
    notes: "Proveedor retirado por incumplimiento",
    since: "2019-09-01",
    avatarColor: "#475569",
  },
]

export function getProviders(): Provider[] {
  return [...providers]
}

export function addProvider(provider: Provider) {
  providers.push(provider)
  return { success: true }
}

export function updateProvider(id: string, data: Partial<Provider>) {
  const idx = providers.findIndex((p) => p.id === id)
  if (idx === -1) return { success: false, error: "Proveedor no encontrado" }
  providers[idx] = { ...providers[idx], ...data }
  return { success: true }
}

export function deleteProvider(id: string) {
  const idx = providers.findIndex((p) => p.id === id)
  if (idx === -1) return { success: false, error: "Proveedor not encontrado" }
  providers.splice(idx, 1)
  return { success: true }
}
