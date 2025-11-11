'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects'
import { ProjectDto } from '@/types/project.types'

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  project?: ProjectDto 
}

export function ProjectDialog({
  open,
  onOpenChange,
  onSuccess,
  project,
}: ProjectDialogProps) {
  const { toast } = useToast()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  })


  const { mutate: createProj, isPending: isCreating } = useCreateProject()
  const { mutate: updateProj, isPending: isUpdating } = useUpdateProject()

  const isEditing = !!project
  const isLoading = isCreating || isUpdating

  useEffect(() => {
    if (isEditing && project) {
      setFormData({
        title: project.title,
        description: project.description,
        startDate: project.startDate.split('T')[0],
        endDate: project.endDate.split('T')[0],
      })
    } else {
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
      })
    }
    setError('')
  }, [open, isEditing, project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.endDate <= formData.startDate) {
      setError('End date must be after start date')
      return
    }

    try {
      if (isEditing && project) {
        updateProj(
          {
            projectId: String(project.id),
            dto: {
              title: formData.title,
              description: formData.description,
              startDate: formData.startDate,
              endDate: formData.endDate,
            },
          },
          {
            onSuccess: (result) => {
              toast({
                title: 'Success',
                description: `${result.title} has been updated successfully.`,
              })
              onOpenChange(false)
              onSuccess?.()
            },
            onError: (err: any) => {
              const errorMessage = err?.message || 'Failed to update project'
              setError(errorMessage)
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
              })
            },
          }
        )
      } else {

        createProj(
          {
            title: formData.title,
            description: formData.description,
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
          {
            onSuccess: (result) => {
              toast({
                title: 'Success',
                description: `${result.title} has been created successfully.`,
              })
              setFormData({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
              })
              onOpenChange(false)
              onSuccess?.()
            },
            onError: (err: any) => {
              const errorMessage = err?.message || 'Failed to create project'
              setError(errorMessage)
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
              })
            },
          }
        )
      }
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the project details below.'
              : 'Add a new project to your workspace. Fill in the details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project title</Label>
              <Input
                id="title"
                placeholder="Enter project name"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
