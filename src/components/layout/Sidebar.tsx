"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GraduationCap, LayoutGrid, Tag, Truck, BarChart2, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Inventario", href: "/inventario", icon: LayoutGrid },
    { name: "Categorías", href: "/categorias", icon: Tag },
    { name: "Proveedores", href: "/proveedores", icon: Truck },
    { name: "Reportes", href: "/reportes", icon: BarChart2 },
    { name: "Configuración", href: "/configuracion", icon: Settings },
  ]

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 border-r border-gray-200 bg-white flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-transparent">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-md flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 leading-none">Braymar</h1>
              <span className="text-xs text-gray-500">School Distributor</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (pathname === '/' && link.href === '/inventario')

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 leading-none">Admin Usuario</span>
            <span className="text-xs text-gray-500">admin@braymar.pe</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
