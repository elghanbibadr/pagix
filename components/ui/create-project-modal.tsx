"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { createWebsite } from "@/app/actions/websitesActions"
import { toast } from "sonner"

export function CreateProjectModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectName.trim()) {
      toast.error("Please enter a project name")
      return
    }

    setIsSubmitting(true)
    try {
      const website = await createWebsite({ 
        name: projectName, 
        description: projectDescription 
      })
      
      if(website.success){

        toast.success("Project created successfully!")
        
        // ✅ Navigate to builder (this triggers immediately)
        router.push(`/builder?websiteId=${website.data.id}`)
        
        // ✅ Reset form and close modal (happens while navigating)
        // The user won't see this because navigation is happening
        setProjectName("")
        setProjectDescription("")
        setIsModalOpen(false)
      }else{
        toast.error(website.error)

      }
      
      
    } catch (error) {
      console.error('❌ Failed to create project:', error)
      toast.error("Failed to create project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleOpenChange = (open: boolean) => {
    // ✅ Only reset if closing (not opening)
    if (!open && !isSubmitting) {
      setProjectName("")
      setProjectDescription("")
    }
    setIsModalOpen(open)
  }

  return (
    <div className="h-full w-full">
      <Button size="lg" onClick={() => setIsModalOpen(true)} className="w-full h-full">
        Start from a Blank Template
      </Button>
      
      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Enter your project details to get started</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="project-name"
                placeholder="My Awesome Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description (Optional)</Label>
              <Textarea
                id="project-description"
                placeholder="Describe what your project is about..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                disabled={isSubmitting}
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)} 
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}