"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole, type UserProjectDto } from "@/types/userproject.types"
import { useAddUserProject } from "@/hooks/useProjects"
import { toast } from "@/hooks/use-toast"

interface AddMemberDialogProps {
  projectId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddMemberDialog({ 
  projectId, 
  open, 
  onOpenChange, 
  onSuccess: onMemberAdded,
}: AddMemberDialogProps) {
  //Hooks
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserProjectDto["role"]>(UserRole.MEMBER)
  const [emailError, setEmailError] = useState('')
  //Mutation hook
  const { mutate: addUser, isPending: isLoading } = useAddUserProject()
  //Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  //Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      alert("Please enter a valid email")
      return
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.")
      return
    }
    
    addUser(
      {
        projectId: String(projectId),
        dto: {
          email,
          role,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Member added successfully.',
          })
          // Limpiar y cerrar
          setEmail('')
          setRole(UserRole.MEMBER)
          setEmailError('')
          onOpenChange(false)
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description:
              error?.response?.data?.message || 'Failed to add member',
            variant: 'destructive',
          })
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={role} 
              onValueChange={(value: UserProjectDto["role"]) => setRole(value)}
              disabled={isLoading}
            >
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
