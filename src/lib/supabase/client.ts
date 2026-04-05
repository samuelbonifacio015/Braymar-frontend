import { getProducts } from "@/data/mock"
import type { Product } from "@/types/inventory"

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    sku: row.sku as string,
    name: row.name as string,
    stock: row.stock as number,
    stockStatus: row.stock_status as Product["stockStatus"],
    location: row.location as Product["location"],
    unitPrice: Number(row.unit_price),
    wholesalePrice: Number(row.wholesale_price),
    category: row.category as string,
    imageUrl: (row.image_url as string) ?? undefined,
  }
}

const supabase = {
  from(table: string) {
    return {
      select(query: string) {
        return {
          order(field: string, opts: { ascending: boolean }) {
            const data = getProducts().map(p => ({
              id: p.id,
              sku: p.sku,
              name: p.name,
              stock: p.stock,
              stock_status: p.stockStatus,
              location: p.location,
              unit_price: p.unitPrice,
              wholesale_price: p.wholesalePrice,
              category: p.category,
              image_url: p.imageUrl,
              created_at: new Date().toISOString(),
            }))
            return Promise.resolve({ data, error: null })
          }
        }
      },
      insert(data: unknown) {
        return Promise.resolve({ error: null })
      },
      update(data: unknown) {
        return {
          eq(col: string, val: unknown) {
            return Promise.resolve({ error: null })
          }
        }
      },
      delete() {
        return {
          eq(col: string, val: unknown) {
            return Promise.resolve({ error: null })
          }
        }
      }
    }
  }
}

export { supabase }
