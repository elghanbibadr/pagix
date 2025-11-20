"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, LogOut, Plus, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUser, logout } from "@/app/actions/actions"
import { useTranslations, useLocale } from "next-intl"
import { useEffect, useState } from "react"
import Image from "next/image"
import logo from "@/public/icons/logo.png"



export default function DashboardSidebar() {

  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations("sidebar")

  // Remove locale from pathname for comparison
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

  const navItems = [
    { href: "/dashboard", label: t("dashboard"), icon: Home },
    { href: "/builder", label: t("createPage"), icon: Plus },
    { href: "/settings", label: t("settings"), icon: Settings },
  ]

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setUserEmail(user.user.email)
        setUserName(user.user.user_metadata.name)
      }
    };
    
    fetchUser();
  }, []);

  return (
    <aside className="w-64 border-r border-border bg-background h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
                    <Image src={logo} alt="pagix logo" height={120} width={120} />

        </Link>
      </div>

      {/* Navigation */}
     <nav className="flex-1 p-2 space-y-2">
  {navItems.map((item) => {
    const Icon = item.icon
    const isActive = 
      pathnameWithoutLocale === item.href || 
      pathnameWithoutLocale.startsWith(item.href + "/")

    return (
      <Link key={item.href} href={`/${locale}${item.href}`}>
        <span className={`w-full flex items-center text-sm font-medium py-3 ${isActive ? "text-[#FFB600] bg-[#fbf9fa]" : ""} hover:text-[#FFB600] hover:bg-[#fbf9fa] px-3 py-2 rounded-md bg-none justify-start gap-3 duration-75 transition-all ease-in group`}>
          <Icon className={`w-5 font-normal h-5 ${isActive ? "text-[#FFB600]" : "text-[#99a1af] group-hover:text-[#FFB600]"}`} />
          {item.label}
        </span>
      </Link>
    )
  })}
</nav>
      {/* User Profile & Logout */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{userName}</p>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
        >
          <LogOut className="w-5 h-5" />
          {t("logout")}
        </Button>
      </div>
    </aside>
  )
}