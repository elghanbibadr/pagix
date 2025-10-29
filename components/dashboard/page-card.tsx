import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MoreVertical, Edit2, Trash2, Copy } from "lucide-react"

interface PageCardProps {
  title: string
  date: string
  status: "Published" | "Draft"
}

export default function PageCard({ title, date, status }: PageCardProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors group">
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link href={`/builder?page=${title.toLowerCase()}`}>
            <button className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              <Edit2 className="w-4 h-4" />
            </button>
          </Link>
          <button className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold">{title}</h3>
          <button className="p-1 hover:bg-secondary rounded">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{date}</p>

        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              status === "Published"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
            }`}
          >
            {status}
          </span>
          <Link href={`/builder?page=${title.toLowerCase()}`}>
            <Button size="sm" variant="ghost">
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
