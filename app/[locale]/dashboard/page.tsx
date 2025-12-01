import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Grid3x3, Search } from "lucide-react"
import PageCard from "@/components/dashboard/page-card"
import TemplateGrid from "@/components/dashboard/template-grid"
import { CreateProjectModal } from "@/components/ui/create-project-modal"
import { getTranslations } from "next-intl/server"
import { getUserWebsites } from "@/app/actions/websitesActions"
import DashboardClient from "@/components/dashboard/dashboard-client"
import UserWebsites from "@/components/user-websites"

export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export default async function DashboardPage() {
  const userWebsites = await getUserWebsites()

  console.log('user websites', userWebsites)
  
  const t = await getTranslations("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">{t("welcome.title")}</h1>
          <p className="text-muted-foreground">{t("welcome.subtitle")}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <CreateProjectModal />
          <Link href="/builder?template=select">
            <Button variant="outline" className="w-full h-24 text-lg gap-2 bg-transparent" size="lg">
              <Grid3x3 className="w-5 h-5" />
              {t("quickActions.chooseTemplate")}
            </Button>
          </Link>
        </div>

        {/* My Pages - Client Component with Search */}
        <UserWebsites 
          websites={userWebsites.data} 
          translations={{
            title: t("myPages.title"),
            searchPlaceholder: t("myPages.searchPlaceholder"),
            publishedStatus: t("myPages.statuses.published"),
            draftStatus: t("myPages.statuses.draft")
          }}
        />

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