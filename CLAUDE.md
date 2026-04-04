# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

**Braymar** — Inventory management system ("Sistema de gestión de inventario"). Uses Next.js 16 App Router with TypeScript, Tailwind CSS, and shadcn/ui components.

## Development Commands

```bash
npm run dev        # Start dev server
npm run build       # Production build
npm run start       # Start production server
npm run lint        # Run ESLint
```

## Architecture

### Layout
- `src/app/layout.tsx` — Root layout with `Sidebar` component and flex layout. Sidebar is always visible (fixed 60px left rail).
- Root page (`src/app/page.tsx`) redirects to `/inventario`.

### Domain: Inventory (`/inventario`)
- `src/app/inventario/page.tsx` — Main inventory page. Client component with:
  - Mock data from `src/data/mock.ts` (no backend yet)
  - Search by name/SKU, filters by category/location/status
  - Pagination (8 items per page)
  - Add product dialog
  - CSV and PDF export buttons (stubbed, not implemented)

### Key Types (`src/types/inventory.ts`)
- `StockStatus`: `"optimo" | "bajo_stock" | "agotado"`
- `Location`: `"Almacén Tienda" | "Cochera" | "Cangallo" | "Santa Anita"`
- `Product`: id, sku, name, stock, stockStatus, location, unitPrice, wholesalePrice, category, imageUrl?

### Component Structure
- `src/components/layout/` — `Sidebar.tsx`, `Topbar.tsx` (app chrome)
- `src/components/inventario/` — `ProductTable.tsx`, `StockBadge.tsx` (domain-specific)
- `src/components/ui/` — shadcn/ui primitives (button, input, dialog, select, table, badge, etc.)
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

### Styling
- Tailwind CSS v3 with custom brand colors via `tailwind.config.ts`
- `src/lib/utils.ts` `cn()` helper for className composition
- shadcn/ui with base-ui (`@base-ui/react`) adapter
