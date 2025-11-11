"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserProjectDto } from "@/types/userproject.types"
import type { UserDto } from "@/types/user.types"
import { useUpdateProjectUserRole } from "@/hooks/useProjects"
import { toast } from "@/hooks/use-toast"

interface ChangeRoleDialogProps {
  user: UserDto
  currentRole: UserProjectDto["role"]
  projectId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ChangeRoleDialog({
  user,
  currentRole,
  projectId,
  open,
  onOpenChange,
  onSuccess,
}: ChangeRoleDialogProps) {
  const [role, setRole] = useState<UserProjectDto["role"]>(currentRole)
  
  //Mutation
  const { mutate: updateUser, isPending: isUpdatingRole } = useUpdateProjectUserRole();

  useEffect(() => {
    setRole(currentRole)
  }, [currentRole])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (role !== currentRole) {
      onOpenChange?.(false)
    }
    updateUser(
            {
              projectId: String(projectId),
              userId: String(user.id),
              dto: {
                role: role
              }
            },
            {
              onSuccess: () => {
                toast({
                  title: 'Success',
                  description: `Role changed to ${role}.`,
                })
                onOpenChange(false)
                onSuccess?.()
              },
              onError: (error: any) => {
                toast({
                  title: 'Error',
                  description: error?.response?.data?.message || 'Failed to change role',
                  variant: 'destructive',
                })
              },
            }
          )

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Role for {user.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value: UserProjectDto["role"]) => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
