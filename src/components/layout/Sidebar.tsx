"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Tag,
  Truck,
  ShoppingCart,
  ArrowLeftRight,
  Clock,
  BarChart2,
  Bell,
  Settings,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

type SectionLink = {
  name: string
  href: string
  icon: React.ComponentType<{ size?: number }>
}

type Section = {
  label: string
  links: SectionLink[]
}

const sections: Section[] = [
  {
    label: "Inventario",
    links: [
      { name: "Inventario", href: "/inventario", icon: LayoutGrid },
      { name: "Categorías", href: "/categorias", icon: Tag },
      { name: "Proveedores", href: "/proveedores", icon: Truck },
    ],
  },
  {
    label: "Operaciones",
    links: [
      { name: "Ventas", href: "/ventas", icon: ShoppingCart },
      { name: "Transferencias", href: "/transferencias", icon: ArrowLeftRight },
      { name: "Historial", href: "/historial", icon: Clock },
    ],
  },
  {
    label: "Análisis",
    links: [
      { name: "Reportes", href: "/reportes", icon: BarChart2 },
      { name: "Alertas", href: "/alertas", icon: Bell },
    ],
  },
  {
    label: "Sistema",
    links: [
      { name: "Configuración", href: "/configuracion", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 border-r border-gray-200 bg-white flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="h-20 border-b border-transparent">
          <Link href="/" className="block w-full h-full">
            <Image
              src="/braymar-logo.png"
              alt="Braymar Logo"
              width={240}
              height={80}
              className="w-full h-full object-contain object-center"
              priority
            />
          </Link>
        </div>

        {/* Navigation grouped by sections */}
        <nav className="p-4 space-y-4">
          {sections.map((section, idx) => (
            <div key={section.label}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                {section.label}
              </p>
              <ul className="space-y-1">
                {section.links.map((link) => {
                  const Icon = link.icon
                  const isActive =
                    pathname === link.href ||
                    (pathname === "/" && link.href === "/inventario")

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-brand-600 text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <Icon size={18} />
                        {link.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {/* Divisor sutil entre secciones (excepto la última) */}
              {idx < sections.length - 1 && (
                <hr className="my-3 border-gray-150" />
              )}
            </div>
          ))}
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
            <span className="text-sm font-medium text-gray-900 leading-none">
              Admin Usuario
            </span>
            <span className="text-xs text-gray-500">admin@braymar.pe</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
