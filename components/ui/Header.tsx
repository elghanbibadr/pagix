"use client"
import { Button } from "@/components/ui/button"
import { getUser } from "@/app/actions/actions"
import { UserMenu } from "./user-menu"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "./language-switcher"
import logo from "@/public/icons/logo.png"

import Image from "next/image"
import { Link } from "@/i18n/routing"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default  function Header({user}:{user:any}) {
  const tNav = useTranslations("nav");



  return (
    <header className="border-b border-border">
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
                   <Image src={logo} alt="pagix logo" height={100} width={100} />
                 </Link>
       
         
          
          <div className="flex items-center gap-4">
            {user.user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">{tNav("signIn")}</Button>
                </Link>
                <Link href="/signup">
                  <Button>{tNav("getStarted")}</Button>
                </Link>
              </>
            )}
            <LanguageSwitcher/>
          </div>
        </div>
      </nav>
    </header>
  )
}