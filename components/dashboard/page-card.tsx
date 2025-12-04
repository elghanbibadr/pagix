'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MoreVertical, Edit2, Trash2, Copy } from "lucide-react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteWebsiteAction } from "@/app/actions/websitesActions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PageCardProps {
  title: string
  date: string
  status: string
  website_id: string
}

export default function PageCard({ title, date, status, website_id }: PageCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault() 
    setIsDeleting(true)
    
    try {
      await deleteWebsiteAction(website_id)
      toast.success("Website deleted successfully!")
      
      setShowDeleteDialog(false)
      
      router.refresh()
    } catch (error) {
      console.error('❌ Failed to delete website:', error)
      toast.error("Failed to delete website. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors group">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Link href={`/builder?websiteId=${website_id}`}>
              <button className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                <Edit2 className="w-4 h-4" />
              </button>
            </Link>
            <button 
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-medium my-3">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">Updated: {date}</p>

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
            <Link href={`/builder?websiteId=${website_id}`}>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={(open) => {
        // ✅ Only allow closing if not currently deleting
        if (!isDeleting) {
          setShowDeleteDialog(open)
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold">{title}</span> and all its pages. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            {/* ✅ Use regular Button instead of AlertDialogAction */}
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}