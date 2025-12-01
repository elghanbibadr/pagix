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
import { getUser } from "@/app/actions/actions"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (projectName: string, projectDescription: string) => void
}

export function CreateProjectModal() {
    const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  // const []
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectName.trim()) {
      alert("Please enter a project name")
      return
    }

    setIsSubmitting(true)
    try {
      // onSubmit(projectName, projectDescription)
      // Reset form
const user=await getUser()
console.log("user",user)
      // handleCreateProject()
     const website= await createWebsite({ name:projectName,description:projectDescription})
     console.log('website',website)
      setProjectName("")
      setProjectDescription("")
       router.push(`/builder?websiteId=${website.data.id}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // onClose()
    }
  }


  const handleCreateProject = async (projectName: string, projectDescription: string) => {

    // TODO: Save project to database/storage if needed
    // For now, we'll just pass it via URL params
    const data = {
      name: projectName,
      description: projectDescription,
    }

    // await createWebsite(data)

    // router.push(`/builder?${params.toString()}`)
    setIsModalOpen(false)
  }
  return (

    <div className="h-full w-full">
    
      <Button size="lg" onClick={() => setIsModalOpen(true)} className="w-full h-full">
          Start from a Blank Template
        </Button>
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Enter your project details to get started</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
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
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  )
}
