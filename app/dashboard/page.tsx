import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Grid3x3, Search } from "lucide-react"
import PageCard from "@/components/dashboard/page-card"
import TemplateGrid from "@/components/dashboard/template-grid"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Create a new page or continue editing your existing projects</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Link href="/builder?template=blank">
            <Button className="w-full h-24 text-lg gap-2" size="lg">
              <Plus className="w-5 h-5" />
              Create Blank Page
            </Button>
          </Link>
          <Link href="/builder?template=select">
            <Button variant="outline" className="w-full h-24 text-lg gap-2 bg-transparent" size="lg">
              <Grid3x3 className="w-5 h-5" />
              Choose Template
            </Button>
          </Link>
        </div>

        {/* My Pages Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Pages</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
          </div>

          {/* Pages Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Portfolio", date: "Updated 2 days ago", status: "Published" },
              { title: "Landing Page", date: "Updated 1 week ago", status: "Draft" },
              { title: "Blog", date: "Updated 3 days ago", status: "Published" },
            ].map((page, i) => (
              <PageCard key={i} {...page} />
            ))}
          </div>
        </div>

        {/* Templates Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Start from Template</h2>
            <p className="text-muted-foreground">Choose from our collection of professionally designed templates</p>
          </div>
          <TemplateGrid />
        </div>
      </main>
    </div>
  )
}
