---
name: braymar-domain
description: >
  Contexto de dominio de negocio para el sistema Braymar — distribuidora de útiles escolares en Perú.
  Activa esta skill SIEMPRE que trabajes en el repositorio Braymar-frontend o cualquier código relacionado
  a Braymar. Úsala cuando el usuario mencione: inventario Braymar, stock, almacenes, roles de usuario,
  transferencias entre almacenes, precios mayorista/minorista, POS, reportes de gerencia, o cualquier
  feature del sistema. También actívala cuando el usuario pida generar código de negocio, tipos TypeScript,
  validaciones, reglas de stock, lógica de precios, o flujos de trabajo relacionados a Braymar.
  Esta skill es el contrato de dominio — todo el código generado debe ser consistente con las reglas aquí definidas.
---

# Braymar — Dominio de Negocio

Braymar es una **distribuidora/librería grande** especializada en productos de uso escolar y de oficina
en Lima, Perú. El sistema gestiona inventario multi-almacén, ventas con POS y reportes para gerencia.

---

## Productos típicos del negocio

Cuadernos (espiral, rayado, cuadriculado), lapiceros (cajas x50), mochilas escolares, borradores (cajas x20),
silicona líquida 250ml, papel crepe surtido (paquetes x10), lienzos 30x40cm, anillados A4 (paquetes x100),
plumones, tijeras, reglas, cartulinas, folders, archivadores, entre otros. Los productos se venden tanto
en unidades sueltas como en presentaciones de caja/paquete.

---

## Ubicaciones / Almacenes

El sistema maneja exactamente **4 ubicaciones**. No agregar más sin confirmación explícita del usuario.

| Ubicación | Rol |
|---|---|
| `Almacén Tienda` | Stock disponible para venta directa al público |
| `Cochera` | Almacén auxiliar dentro de la tienda |
| `Cangallo` | Almacén central (calle Cangallo, Lima) |
| `Santa Anita` | Almacén central (distrito Santa Anita, Lima) |

En TypeScript, el tipo es:
```ts
type Location = "Almacén Tienda" | "Cochera" | "Cangallo" | "Santa Anita"
```

---

## Estados de Stock

Tres estados posibles. Los umbrales exactos deben ser configurables por admin, pero estos son los defaults:

| Estado | Valor TypeScript | Condición default | Color UI |
|---|---|---|---|
| Óptimo | `"optimo"` | stock > 20 unidades | Verde (`#16a34a` / `text-green-700 bg-green-100`) |
| Bajo Stock | `"bajo_stock"` | stock entre 1 y 20 | Amarillo (`#ca8a04` / `text-yellow-700 bg-yellow-100`) |
| Agotado | `"agotado"` | stock = 0 | Rojo (`#dc2626` / `text-red-700 bg-red-100`) |

La función para calcular el estado:
```ts
function getStockStatus(stock: number, minThreshold = 20): StockStatus {
  if (stock === 0) return "agotado"
  if (stock <= minThreshold) return "bajo_stock"
  return "optimo"
}
```

---

## Tipos TypeScript canónicos

Estos son los tipos de dominio. **No modificar sin actualizar este skill.**

```ts
// types/inventory.ts

export type StockStatus = "optimo" | "bajo_stock" | "agotado"

export type Location = "Almacén Tienda" | "Cochera" | "Cangallo" | "Santa Anita"

export type Category =
  | "Cuadernos"
  | "Escritura"
  | "Mochilas"
  | "Útiles de Escritorio"
  | "Manualidades"
  | "Arte"
  | "Oficina"
  | string // permite categorías personalizadas

export interface Product {
  id: string
  sku: string           // Formato: #XX-NNNNN (ej: #BK-10293)
  name: string
  stock: number
  stockStatus: StockStatus
  location: Location
  unitPrice: number     // Precio minorista en Soles (S/)
  wholesalePrice: number // Precio mayorista en Soles (S/)
  category: Category
  imageUrl?: string
  minStockThreshold?: number // umbral personalizado, default 20
}

export interface StockMovement {
  id: string
  productId: string
  date: string          // ISO 8601
  type: "entrada" | "salida" | "transferencia"
  quantity: number
  originLocation?: Location
  destinationLocation?: Location
  responsibleUser: string
  notes?: string
}

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

## Roles de Usuario y Permisos

| Rol | Descripción | Permisos |
|---|---|---|
| `admin` | Acceso total al sistema | CRUD productos, ventas, reportes, usuarios, configuración, transferencias |
| `vendedor` | Opera el punto de venta | Ver inventario (sin editar), registrar ventas POS, ver su historial de ventas |
| `almacenero` | Gestiona el stock físico | Registrar entradas/salidas, hacer transferencias, ver historial de movimientos |
| `gerencia` | Supervisión y analytics | Solo lectura: todos los reportes, ganancias, métricas, KPIs — sin operaciones |

Regla importante: **gerencia NO puede modificar nada**, solo visualizar. Si se genera código con permisos,
aplicar este principio estrictamente.

---

## Sistema de Precios

Cada producto tiene **dos precios en Soles (S/)**:

- `unitPrice` — precio **minorista** (venta al público final, por unidad)
- `wholesalePrice` — precio **mayorista** (venta por volumen, siempre menor que el minorista)

Regla de validación: `wholesalePrice < unitPrice`. Si no se cumple, mostrar error de validación.

En el POS, el vendedor selecciona el tipo de precio antes de cerrar la venta. El descuento mayorista
no es porcentual fijo — cada producto tiene su propio precio mayorista definido.

---

## Módulos del sistema

### 1. Inventario (implementado — `/inventario`)
Tabla principal de productos con filtros, búsqueda, paginación (8 items/página), badges de stock y acciones CRUD.

### 2. Categorías (`/categorias`) — pendiente
CRUD simple de categorías. Cada categoría tiene: nombre, descripción opcional, conteo de productos asociados.
Las categorías son la principal forma de filtrar el inventario.

### 3. Reportes (`/reportes`) — pendiente
Vista exclusiva para rol `gerencia` y `admin`. Seis tipos de reporte:
- Stock por almacén (barras agrupadas por ubicación)
- Ventas por período (línea temporal, filtrable por día/semana/mes)
- Productos más vendidos (barras horizontales, top 10)
- Ganancias y márgenes (línea + área, diferencia precio venta vs costo)
- Movimientos de inventario (tabla con timeline)
- Proveedores y compras (tabla — futuro)

Librería de gráficos: **Recharts** (compatible con shadcn/ui, ya en el stack sugerido).

### 4. Configuración (`/configuracion`) — pendiente
Gestión de usuarios y roles, administración de almacenes, umbrales de stock mínimo por producto o global.

### 5. POS / Ventas (`/ventas`) — fase futura
Carrito con búsqueda de productos, selector minorista/mayorista, métodos de pago (efectivo, Yape/Plin, tarjeta),
emisión de boleta. Integración con caja física en roadmap posterior.

---

## Reglas de SKU

Formato: `#XX-NNNNN` donde `XX` son 2 letras de la categoría y `NNNNN` son 5 dígitos.

Ejemplos reales del sistema:
- `#BK-10293` — Cuaderno (BooK)
- `#PN-99201` — Lapicero (PeN)
- `#BC-55231` — Mochila (BaCkpack)
- `#ER-12003` — Borrador (ERaser)
- `#GL-44021` — Silicona (GLue)
- `#PC-88990` — Papel Crepe (Paper Crepe)
- `#LZ-30400` — Lienzo (LienZo)
- `#AN-A4200` — Anillado A4

Para auto-generar un SKU nuevo: prefijo de 2 letras según categoría + número aleatorio de 5 dígitos.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14+ con App Router (NO usar Pages Router) |
| UI | shadcn/ui + Tailwind CSS v3 |
| Iconos | Lucide React |
| Lenguaje | TypeScript estricto (no usar `any`) |
| Estado local | `useState` / `useReducer` (no Zustand en esta fase) |
| Routing | URL search params para filtros compartibles |
| Gráficos | Recharts |
| Fuente | Geist Sans (incluida en Next.js 14+) |

---

## Colores corporativos

```ts
// tailwind.config.ts → extend.colors
brand: {
  DEFAULT: "#2563EB",
  50:  "#EFF6FF",
  100: "#DBEAFE",
  600: "#2563EB",
  700: "#1D4ED8",
  800: "#1E40AF",
}
```

El azul `#2563EB` es el color primario de Braymar. Sidebar activo usa este color como fondo con texto blanco.

---

## Convenciones de código

- Todos los comentarios de negocio en **español**
- Nombres de variables y funciones en **inglés** (camelCase)
- Nombres de componentes en **PascalCase**
- Usar `cn()` de `src/lib/utils.ts` para composición de clases Tailwind
- Los datos mock viven en `src/data/mock.ts` con una función `getProducts()` exportada
- No hardcodear strings de ubicación o estado — usar siempre los tipos `Location` y `StockStatus`
- Validar `wholesalePrice < unitPrice` en formularios de producto

---

## Datos mock de referencia

Los 8 productos del mock actual (para mantener consistencia en tests y desarrollo):

| SKU | Producto | Stock | Estado | Ubicación | Precio |
|---|---|---|---|---|---|
| #BK-10293 | Cuaderno Espiral A4 - 100hj | 540 | optimo | Almacén Tienda | S/ 12.50 |
| #PN-99201 | Lapiceros Azul (Caja x50) | 12 | bajo_stock | Cochera | S/ 45.00 |
| #BC-55231 | Mochila Escolar Urbana | 0 | agotado | Santa Anita | S/ 89.90 |
| #ER-12003 | Borrador Blanco (Caja x20) | 120 | optimo | Cangallo | S/ 18.20 |
| #GL-44021 | Silicona Líquida 250ml | 18 | bajo_stock | Almacén Tienda | S/ 5.50 |
| #PC-88990 | Papel Crepe Surtido (Paquete x10) | 250 | optimo | Cochera | S/ 10.00 |
| #LZ-30400 | Lienzo 30x40cm | 45 | optimo | Santa Anita | S/ 15.00 |
| #AN-A4200 | Anillado A4 (Paquete x100) | 5 | bajo_stock | Cangallo | S/ 35.00 |

---

## Lo que NO hacer

- No usar `pages/` router — solo App Router
- No instalar librerías de UI adicionales (solo shadcn)
- No hardcodear colores fuera de Tailwind config o CSS variables
- No dar acceso de escritura al rol `gerencia`
- No crear más de 4 ubicaciones sin confirmación del usuario
- No conectar backend real en fase de desarrollo con mock data
- No usar `any` en TypeScript
