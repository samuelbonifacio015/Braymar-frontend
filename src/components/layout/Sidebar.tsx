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
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ProfileInfo } from "@/types/settings"

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

interface SidebarProps {
  collapsed?: boolean
  profile?: ProfileInfo
  isMobileDrawer?: boolean
  open?: boolean
  onClose?: () => void
}

export function Sidebar({
  collapsed = false,
  profile,
  isMobileDrawer = false,
  open = true,
  onClose,
}: SidebarProps) {
  const pathname = usePathname()

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
    : "AU"

  /* Mobile drawer: full-width overlay with slide-in animation */
  if (isMobileDrawer) {
    return (
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-dvh w-72 bg-white border-r border-gray-200",
          "flex flex-col justify-between",
          "transform transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-md",
              "min-w-[44px] min-h-[44px] flex items-center justify-center",
              "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
              "active:scale-95 transition-transform"
            )}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div>
          {/* Logo */}
          <div className="h-20 border-b border-transparent px-4 flex items-center">
            <Link href="/" className="block h-full" onClick={onClose}>
              <Image
                src="/braymar-logo.png"
                alt="Braymar Logo"
                width={240}
                height={80}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-4 overflow-y-auto max-h-[calc(100dvh-10rem)]">
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
                          onClick={onClose}
                          className={cn(
                            "w-full flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
                            "px-3 py-3 min-h-[44px]",
                            "active:scale-[0.98] transition-transform",
                            isActive
                              ? "bg-brand-600 text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <Icon size={18} />
                          {link.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                {idx < sections.length - 1 && (
                  <hr className="my-3 border-gray-200" />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} />}
              <AvatarFallback className="bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-900 leading-none truncate">
                {profile?.name || "Admin Usuario"}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {profile?.email || "admin@braymar.pe"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    )
  }

  /* Desktop sidebar: fixed position with collapsible width */
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen border-r border-gray-200 bg-white flex flex-col justify-between transition-[width] duration-300 ease-in-out z-20 overflow-hidden",
        collapsed ? "w-[72px]" : "w-60"
      )}
    >
      <div>
        {/* Logo */}
        <div className={cn("h-20 border-b border-transparent", collapsed && "flex items-center justify-center")}>
          <Link href="/" className="block w-full h-full">
            {collapsed ? (
              <Image
                src="/braymar-logo.png"
                alt="Braymar Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain mx-auto mt-5"
                priority
              />
            ) : (
              <Image
                src="/braymar-logo.png"
                alt="Braymar Logo"
                width={240}
                height={80}
                className="w-full h-full object-contain object-center"
                priority
              />
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className={cn("p-4 space-y-4", collapsed && "px-2")}>
          {sections.map((section, idx) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                  {section.label}
                </p>
              )}
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
                        title={collapsed ? link.name : undefined}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
                          collapsed
                            ? "justify-center px-2 py-2.5"
                            : "px-3 py-2.5",
                          isActive
                            ? "bg-brand-600 text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <Icon size={18} />
                        {!collapsed && link.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {idx < sections.length - 1 && (
                <hr className="my-3 border-gray-200" />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className={cn("p-4 border-t border-gray-200", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="h-9 w-9 shrink-0">
            {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} />}
            <AvatarFallback className="bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-900 leading-none truncate">
                {profile?.name || "Admin Usuario"}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {profile?.email || "admin@braymar.pe"}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
