import type React from "react"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
  <DashboardSidebar />
  
  <main className="flex-1  flex flex-col overflow-auto">
   <div className="flex justify-end border-b-[1px]  p-3">
      <LanguageSwitcher />
    </div>
    
    <div className="flex-1 border-[1px] overflow-hidden border m-5 rounded-2xl ">
      {children}
    </div>
  </main>
</div>
  )
}
