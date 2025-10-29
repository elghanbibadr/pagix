import Link from "next/link"
import { Button } from "@/components/ui/button"

const templates = [
  { id: 1, name: "Portfolio", icon: "🎨" },
  { id: 2, name: "E-Commerce", icon: "🛍️" },
  { id: 3, name: "Blog", icon: "📝" },
  { id: 4, name: "SaaS", icon: "💼" },
  { id: 5, name: "Agency", icon: "🚀" },
  { id: 6, name: "Restaurant", icon: "🍽️" },
]

export default function TemplateGrid() {
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
                Use Template
              </Button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
