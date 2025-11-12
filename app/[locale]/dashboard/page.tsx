import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Grid3x3, Search } from "lucide-react"
import PageCard from "@/components/dashboard/page-card"
import TemplateGrid from "@/components/dashboard/template-grid"
import { useTranslations } from "next-intl"

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const pages = [
    { title: "Portfolio", date: "Updated 2 days ago", status: "published" },
    { title: "Landing Page", date: "Updated 1 week ago", status: "draft" },
    { title: "Blog", date: "Updated 3 days ago", status: "published" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">{t("welcome.title")}</h1>
          <p className="text-muted-foreground">{t("welcome.subtitle")}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Link href="/builder?template=blank">
            <Button className="w-full h-24 text-lg gap-2" size="lg">
              <Plus className="w-5 h-5" />
              {t("quickActions.createBlank")}
            </Button>
          </Link>
          <Link href="/builder?template=select">
            <Button variant="outline" className="w-full h-24 text-lg gap-2 bg-transparent" size="lg">
              <Grid3x3 className="w-5 h-5" />
              {t("quickActions.chooseTemplate")}
            </Button>
          </Link>
        </div>

        {/* My Pages */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("myPages.title")}</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("myPages.searchPlaceholder")}
                  className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pages.map((page, i) => (
              <PageCard
                key={i}
                title={page.title}
                date={page.date}
                status={t(`myPages.statuses.${page.status}`)}
              />
            ))}
          </div>
        </div>

        {/* Templates */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{t("templates.title")}</h2>
            <p className="text-muted-foreground">{t("templates.subtitle")}</p>
          </div>
          <TemplateGrid />
        </div>
      </main>
    </div>
  );
}