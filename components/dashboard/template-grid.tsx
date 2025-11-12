import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TemplateGrid() {
  const t = useTranslations("templates")

  const templates = [
    { id: 1, name: t("portfolio"), icon: "🎨" },
    { id: 2, name: t("ecommerce"), icon: "🛍️" },
    { id: 3, name: t("blog"), icon: "📝" },
    { id: 4, name: t("saas"), icon: "💼" },
    { id: 5, name: t("agency"), icon: "🚀" },
    { id: 6, name: t("restaurant"), icon: "🍽️" },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Link key={template.id} href={`/builder?template=${template.id}`}>
          <div className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer group">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
              {template.icon}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-3">{template.name}</h3>
              <Button className="w-full" size="sm">
                {t("useTemplate")}
              </Button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
