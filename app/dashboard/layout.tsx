import type React from "react"
import DashboardSidebar from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
