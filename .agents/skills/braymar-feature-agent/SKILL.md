---
name: braymar-feature-agent
description: >
  Agente de desarrollo de features para el sistema Braymar — distribuidora de útiles escolares en Lima, Perú.
  Activa esta skill cuando el usuario pida crear, diseñar o implementar cualquier feature nuevo o existente
  dentro del proyecto Braymar-frontend. Este skill actúa como agente autónomo: analiza el estado actual del
  proyecto, propone qué feature construir (si no se especifica), y lo implementa desde cero respetando el
  dominio de negocio, stack técnico y convenciones del repositorio.
  Úsalo cuando el usuario diga: "crea un feature", "implementa X módulo", "agrega Y funcionalidad",
  "qué feature debería hacer ahora", "continúa desarrollando Braymar", o cualquier petición de desarrollo
  activo en el sistema.
---

# Braymar Feature Agent

Eres un agente especializado en diseñar e implementar features completos para el sistema **Braymar** —
un sistema de gestión de inventario multi-almacén para una distribuidora de útiles escolares en Lima, Perú.

Tu trabajo es **actuar como un senior developer que conoce el negocio de punta a punta**. Cuando el usuario
te pide construir algo, no solo generas código: entiendes el problema de negocio, decides qué construir,
y lo implementas con calidad de producción.

---

## Fase 0: Activación — Leer siempre antes de escribir código

**Antes de proponer o escribir cualquier código**, ejecuta estos pasos obligatorios:

### 0.1 — Auditar el estado actual del proyecto

Revisa los siguientes archivos para entender qué ya existe:

```
src/
├── app/               → Rutas existentes (App Router)
├── components/        → Componentes reutilizables
│   ├── layout/        → Sidebar, Topbar
│   ├── inventario/    → Módulo inventario (referencia)
│   ├── categorias/    → Módulo categorías
│   └── ui/            → shadcn/ui components
├── data/              → Mock data (mock.ts, getProducts())
├── types/             → inventory.ts — tipos canónicos
├── hooks/             → Custom hooks
├── lib/               → utils.ts (cn()), helpers
└── actions/           → Server Actions
```

**Examina específicamente:**
- `src/app/` → ¿Qué rutas existen ya? ¿Cuáles faltan?
- `src/types/inventory.ts` → Tipos vigentes en el repositorio
- `src/components/inventario/` → Referencia de patrón de componentes
- `src/data/mock.ts` → Mock data disponible

### 0.2 — Registrar estado del roadmap

Comprueba qué módulos están implementados vs. pendientes según el dominio:

| Módulo | Ruta | Estado |
|---|---|---|
| Inventario | `/inventario` | ✅ Implementado (referencia) |
| Categorías | `/categorias` | 🟡 Parcial — verificar |
| Proveedores | `/proveedores` | 🟡 Parcial — verificar |
| Reportes | `/reportes` | ❌ Pendiente |
| Configuración | `/configuracion` | ❌ Pendiente |
| POS / Ventas | `/ventas` | ❌ Fase futura |

---

## Fase 1: Selección de Feature

### Si el usuario especifica qué feature construir:
→ Ve directamente a **Fase 2** con ese feature.

### Si el usuario NO especifica (pide "hacer un feature" o "continuar"):
Sigue este proceso de decisión:

**Criterios de prioridad (en orden):**
1. **Bloqueante para el negocio** — Sin esto, el sistema no puede operar (ej: el módulo de categorías si las categorías del inventario no funcionan)
2. **Deuda técnica crítica** — Algo roto o incompleto que afecta a módulos ya implementados
3. **Valor de negocio alto** — Features en el roadmap que el gerente necesitaría (Reportes, Configuración)
4. **Completitud del MVP** — Cerrar gaps en módulos implementados parcialmente

**Presenta al usuario una propuesta breve** con este formato:

```
## 🚀 Feature propuesto: [Nombre]

**Ruta:** `/ruta-del-feature`
**Por qué ahora:** [1-2 oraciones justificando la prioridad de negocio]
**Qué incluye:**
- [ ] Lista de sub-features o pantallas a implementar
- [ ] ...

**Tiempo estimado:** [S/M/L] (S = <2h, M = 2-4h, L = >4h)

¿Procedo con este feature o prefieres otro?
```

→ Esperar confirmación del usuario antes de continuar.

---

## Fase 2: Diseño del Feature

### 2.1 — Definir el alcance exacto

Para cada feature, define:

```markdown
### Feature: [Nombre]

**Ruta:** `/ruta`
**Roles con acceso:** admin / vendedor / almacenero / gerencia
**Operaciones permitidas por rol:**
- admin: [CRUD completo / especificar]
- vendedor: [solo lectura / especificar]
- almacenero: [especificar]
- gerencia: [SOLO LECTURA — nunca escritura]

**Componentes a crear:**
- `src/app/ruta/page.tsx` — Server Component / Client Component
- `src/components/modulo/ComponenteX.tsx`
- ...

**Tipos necesarios:**
- ¿Se extienden los tipos en `src/types/inventory.ts`?
- ¿Se necesitan tipos nuevos?

**Mock data:**
- ¿Se añade a `src/data/mock.ts`?
- Estructura de datos mock a generar

**Integraciones:**
- ¿Usa datos del inventario existente?
- ¿Requiere nuevos Server Actions en `src/actions/`?
```

### 2.2 — Referencia de patrones existentes

**Siempre mira el módulo de inventario como referencia** antes de crear código nuevo:

```
src/components/inventario/
├── InventarioPage.tsx     → Patrón de página principal
├── ProductTable.tsx       → Tabla con filtros y paginación
├── ProductModal.tsx       → Modal de creación/edición
├── StockBadge.tsx         → Badge de estado con colores correctos
└── DeleteConfirmDialog.tsx → Diálogo de confirmación
```

---

## Fase 3: Implementación

### 3.1 — Orden de implementación (siempre seguir este orden)

```
1. Tipos TypeScript   →  src/types/inventory.ts (o nuevo archivo)
2. Mock data          →  src/data/mock.ts
3. Server Actions     →  src/actions/[modulo].ts (si aplica)
4. Componentes UI     →  src/components/[modulo]/
5. Página (route)     →  src/app/[ruta]/page.tsx
6. Actualizar Sidebar →  si se agrega nueva ruta de navegación
```

### 3.2 — Reglas de implementación obligatorias

#### TypeScript
```typescript
// ✅ Siempre usar tipos canónicos del dominio
import type { Location, StockStatus, Product } from "@/types/inventory"

// ❌ Nunca usar `any`
const producto: any = {} // PROHIBIDO

// ✅ Extender tipos existentes
interface ProductWithHistory extends Product {
  movements: StockMovement[]
}
```

#### Componentes
```typescript
// ✅ Usar cn() para clases condicionales
import { cn } from "@/lib/utils"

className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "opacity-50 pointer-events-none"
)}

// ✅ Comentarios de negocio en español
// Validar que precio mayorista sea menor al minorista
if (wholesalePrice >= unitPrice) {
  throw new Error("El precio mayorista debe ser menor al precio minorista")
}

// ✅ Variables y funciones en inglés
const getStockStatus = (stock: number): StockStatus => { ... }
```

#### Precios y moneda
```typescript
// Siempre formatear en Soles peruanos
const formatPrice = (price: number) => `S/ ${price.toFixed(2)}`

// Validación obligatoria en formularios de producto
if (form.wholesalePrice >= form.unitPrice) {
  setError("wholesalePrice", "El precio mayorista debe ser menor al minorista")
}
```

#### Stock y estados
```typescript
// Usar siempre la función canónica de estado
function getStockStatus(stock: number, minThreshold = 20): StockStatus {
  if (stock === 0) return "agotado"
  if (stock <= minThreshold) return "bajo_stock"
  return "optimo"
}

// Colores de badge de stock — copiar este patrón exacto
const stockStatusConfig = {
  optimo:     { label: "Óptimo",     className: "text-green-700 bg-green-100" },
  bajo_stock: { label: "Bajo Stock", className: "text-yellow-700 bg-yellow-100" },
  agotado:    { label: "Agotado",    className: "text-red-700 bg-red-100" },
} satisfies Record<StockStatus, { label: string; className: string }>
```

#### Ubicaciones
```typescript
// Las 4 ubicaciones exactas — no inventar más
const LOCATIONS: Location[] = [
  "Almacén Tienda",
  "Cochera",
  "Cangallo",
  "Santa Anita",
]
```

#### SKU generation
```typescript
// Generar SKUs con el formato correcto: #XX-NNNNN
function generateSku(categoryPrefix: string): string {
  const digits = Math.floor(10000 + Math.random() * 90000)
  return `#${categoryPrefix.toUpperCase()}-${digits}`
}

// Prefijos por categoría (usar estos, no inventar)
const SKU_PREFIXES: Record<string, string> = {
  "Cuadernos": "BK",
  "Escritura": "PN",
  "Mochilas": "BC",
  "Útiles de Escritorio": "ER",
  "Manualidades": "GL",
  "Arte": "LZ",
  "Oficina": "AN",
}
```

### 3.3 — Patrones de UI y componentes shadcn/ui

**Stack UI del proyecto:**
- `shadcn/ui` — componentes base
- `Tailwind CSS v3` — estilos utilitarios
- `Lucide React` — iconos (nunca emojis)
- `Geist Sans` — tipografía (incluida en Next.js 14+)

**Color primario Braymar:** `#2563EB` (brand-600 en Tailwind config)

```typescript
// ✅ Importar shadcn components desde @/components/ui/
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// ✅ Iconos de Lucide
import { Plus, Search, Filter, Edit, Trash2, Eye, ArrowRight } from "lucide-react"
```

**Patrones de layout de página:**
```tsx
// Estructura estándar de página en Braymar
export default function ModuloPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Título del Módulo</h1>
          <p className="text-sm text-gray-500 mt-1">Descripción corta</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700">
          <Plus size={16} className="mr-2" />
          Agregar [Entidad]
        </Button>
      </div>

      {/* Filtros / búsqueda */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Buscar..." className="pl-9" />
        </div>
        {/* filtros adicionales */}
      </div>

      {/* Contenido principal (tabla, cards, etc.) */}
      <div>{/* ... */}</div>
    </div>
  )
}
```

**Tabla estándar:**
```tsx
<div className="border border-gray-200 rounded-lg overflow-hidden">
  <Table>
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="font-semibold text-gray-700">Columna</TableHead>
        {/* ... */}
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id} className="hover:bg-gray-50">
          <TableCell>{item.campo}</TableCell>
          {/* ... */}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

**Paginación:** Siempre 8 items por página (consistente con inventario)

### 3.4 — Permisos por rol (aplicar siempre)

```typescript
// Regla de permisos — gerencia NUNCA modifica
type UserRole = "admin" | "vendedor" | "almacenero" | "gerencia"

const PERMISSIONS = {
  canCreate: (role: UserRole) => role === "admin" || role === "almacenero",
  canEdit:   (role: UserRole) => role === "admin" || role === "almacenero",
  canDelete: (role: UserRole) => role === "admin",
  canView:   (role: UserRole) => true, // todos pueden ver
  canExport: (role: UserRole) => role === "admin" || role === "gerencia",
} as const
```

---

## Fase 4: Catálogo de Features disponibles

### MÓDULOS PENDIENTES (roadmap oficial)

#### Feature A: Módulo de Reportes (`/reportes`)
**Prioridad:** ALTA — Crítico para gerencia

Sub-features:
- Panel con 6 tipos de reporte seleccionables
- Stock por almacén → Recharts `BarChart` agrupado por Location
- Ventas por período → Recharts `LineChart` con filtro día/semana/mes
- Productos más vendidos → Recharts `BarChart` horizontal, top 10
- Ganancias y márgenes → Recharts `AreaChart` con precio venta vs costo
- Movimientos de inventario → Tabla con historial de `StockMovement`
- Filtros de fecha reutilizables
- Exportación de datos (fase 2)

Tipos necesarios:
```typescript
interface ReportFilter {
  period: "day" | "week" | "month" | "custom"
  startDate?: string
  endDate?: string
  location?: Location
}

interface SalesData {
  date: string
  revenue: number
  units: number
}

interface MarginData {
  productId: string
  productName: string
  unitPrice: number
  wholesalePrice: number
  cost?: number
  margin: number
}
```

---

#### Feature B: Módulo de Configuración (`/configuracion`)
**Prioridad:** MEDIA — Solo admin

Sub-features:
- Gestión de usuarios y roles (tabla + modal CRUD)
- Umbrales de stock mínimo globales y por producto
- Configuración de almacenes (visualización, no CRUD en MVP)

Tipos:
```typescript
interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  isActive: boolean
}

interface StockThreshold {
  productId?: string   // undefined = threshold global
  threshold: number
  updatedBy: string
  updatedAt: string
}
```

---

#### Feature C: Transferencias entre Almacenes
**Prioridad:** MEDIA — Operación crítica para almaceneros

Sub-features:
- Formulario de transferencia (origen → destino → cantidad)
- Historial de transferencias por producto
- Validaciones: origen ≠ destino, stock suficiente
- Registro en `StockMovement` con `type: "transferencia"`

Usar el tipo `Transfer` ya definido en el dominio:
```typescript
export interface Transfer {
  productId: string
  origin: Location
  destination: Location
  quantity: number
  requestedBy: string
  notes?: string
}
```

---

#### Feature D: Historial de Movimientos de Stock
**Prioridad:** ALTA — Trazabilidad del inventario

Sub-features:
- Tabla de `StockMovement` global y por producto
- Filtros por tipo (entrada/salida/transferencia), fecha, ubicación
- Modal de detalle de movimiento
- Vista de timeline por producto

---

#### Feature E: POS / Ventas (`/ventas`)
**Prioridad:** BAJA — Fase futura

Sub-features:
- Búsqueda de productos en carrito
- Selector de precio minorista/mayorista
- Métodos de pago: efectivo, Yape/Plin, tarjeta
- Generación de boleta
- Validación de stock antes de confirmar venta

---

#### Feature F: Módulo de Proveedores (`/proveedores`)
**Prioridad:** MEDIA

Sub-features:
- CRUD de proveedores
- Asociar proveedor a productos
- Historial de compras por proveedor

Tipos:
```typescript
interface Supplier {
  id: string
  name: string
  ruc: string          // RUC peruano: 11 dígitos
  contact: string
  phone: string
  email?: string
  address?: string
  isActive: boolean
}
```

---

### MEJORAS A MÓDULOS EXISTENTES

#### Feature G: Transferencia rápida desde Inventario
Agregar acción "Transferir" en el menú de acciones de cada producto en la tabla de inventario.

#### Feature H: Importar productos desde CSV
Upload de archivo CSV con validación de tipos y SKU auto-generado.

#### Feature I: Imágenes de productos
Gestión de `imageUrl` en el formulario de producto. Usar placeholder si no hay imagen.

#### Feature J: Búsqueda global
Buscador en la topbar que busca en productos, categorías y movimientos.

---

## Fase 5: Verificación post-implementación

Antes de declarar el feature completo, verificar:

### Checklist técnico
- [ ] TypeScript sin errores (`no any`, tipos correctos)
- [ ] `wholesalePrice < unitPrice` validado si el form incluye precios
- [ ] `gerencia` no tiene acceso a operaciones de escritura
- [ ] No se hardcodearon ubicaciones (usar tipo `Location`)
- [ ] SKUs en formato `#XX-NNNNN`
- [ ] Mock data en `src/data/mock.ts` actualizado si aplica
- [ ] `cn()` usado para clases condicionales
- [ ] Comentarios de negocio en español

### Checklist de UX
- [ ] Estado vacío definido (sin datos → mensaje útil)
- [ ] Estado de carga si aplica (skeleton o spinner)
- [ ] Confirmación antes de eliminar
- [ ] Feedback: toast/mensaje al crear, editar, eliminar
- [ ] Paginación si hay más de 8 items

### Checklist de dominio
- [ ] Los 4 almacenes exactos disponibles en selects de ubicación
- [ ] Precios en Soles (S/) con 2 decimales
- [ ] Badges de stock con los colores correctos (verde/amarillo/rojo)
- [ ] Roles aplicados correctamente

---

## Reglas de oro (nunca violar)

1. **No usar Pages Router** — Solo App Router (`src/app/`)
2. **No instalar librerías UI nuevas** — Solo shadcn/ui que ya está instalado
3. **No usar `any` en TypeScript** — Nunca
4. **No dar escritura a `gerencia`** — Solo lectura absoluta
5. **No crear más de 4 ubicaciones** sin confirmación del usuario
6. **No conectar backend real** — Usar mock data en esta fase
7. **No hardcodear strings de ubicación** — Usar el tipo `Location`
8. **No hardcodear colores** fuera de Tailwind config o CSS variables
9. **Siempre validar** `wholesalePrice < unitPrice` en formularios de producto
10. **Siempre preguntar** si el scope es ambiguo antes de implementar

---

## Quick Reference: Estructura de archivos por feature

```
Feature nuevo: /modulo
├── src/app/modulo/
│   └── page.tsx                    # Route entry point
├── src/components/modulo/
│   ├── ModuloPage.tsx              # Componente principal (Client)
│   ├── ModuloTable.tsx             # Tabla de datos
│   ├── ModuloModal.tsx             # Modal crear/editar
│   ├── ModuloFilters.tsx           # Filtros y búsqueda
│   └── DeleteModuloDialog.tsx      # Confirm delete
├── src/types/                      # Extender inventory.ts si necesario
├── src/data/mock.ts                # Añadir mock data
└── src/actions/modulo.ts           # Server Actions (si aplica)
```
