export async function createSupabaseServerClient() {
  const { getProducts } = await import("@/data/mock")
  const products = getProducts().map(p => ({
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
  return {
    from(table: string) {
      return {
        select(query: string) {
          return {
            order(field: string, opts: { ascending: boolean }) {
              return Promise.resolve({ data: products, error: null })
            }
          }
        },
        insert(data: unknown) { return Promise.resolve({ error: null as null }) },
        update(data: unknown) {
          return { eq(col: string, val: unknown) { return Promise.resolve({ error: null as null }) } }
        },
        delete() {
          return { eq(col: string, val: unknown) { return Promise.resolve({ error: null as null }) } }
        }
      }
    }
  }
}
