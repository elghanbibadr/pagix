"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, LogOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/actions"

export default function DashboardSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/builder", label: "Create Page", icon: Plus },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 border-r border-border bg-background h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">P</span>
          </div>
          <span className="text-xl font-bold">Pagix</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-3">
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-muted-foreground">john@example.com</p>
        </div>
        <Button onClick={logout} variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive">
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
