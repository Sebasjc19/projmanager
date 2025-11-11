"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskStatus, TaskDto } from "@/types/task.types";
import { useCreateTask, useProjectUsers, useUpdateTask } from "@/hooks/useProjects";
import { toast } from "@/hooks/use-toast";

interface TaskDialogProps {
  projectId: number;
  task?: TaskDto
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TaskDialog({
  projectId,
  task,
  open,
  onOpenChange,
  onSuccess,
}: TaskDialogProps) {
  const isEdit = !!task;

  // Field filling
    useEffect(() => {
    if (open && isEdit && task) {
      setFormData({
        title: task.title,
        description: task.description,
        state: task.state,
        startDate: task.startDate.split('T')[0],
        endDate: task.endDate.split('T')[0],
        assignedUsers: Array.isArray(task.assignedUsers) ? task.assignedUsers.map(user =>
          typeof user === 'number' ? user : user.id
        )
        : [],
      })
    } else if (open && !isEdit) {
      setFormData({
        title: '',
        description: '',
        state: TaskStatus.TODO,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        assignedUsers: [],
      })
    }
  }, [open, isEdit, task])

  //Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    state: TaskStatus.TODO as TaskDto["state"],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    assignedUsers: [] as number[],
  });


  //Mutation hook
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  //Loading
  const isLoading = isCreating || isUpdating;
  //Fetch data
  const { data: projectUsers = [] } = useProjectUsers(String(projectId))

  //Validation
  const validateDates = (startDate: string, endDate: string) => {
    return new Date(startDate) <= new Date(endDate);
  };

  //Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDates(formData.startDate, formData.endDate)) {
      toast({
        title: 'Error',
        description: 'End date must be after start date.',
        variant: 'destructive',
      })
      return
    }
    if (isEdit && task) {
      updateTask(
        {
          projectId: String(projectId),
          taskId: String(task.id),
          dto: {
            title: formData.title,
            description: formData.description,
            state: formData.state,
            startDate: formData.startDate,
            endDate: formData.endDate,
            assignedUserIds: formData.assignedUsers,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Task updated successfully.",
            });
            onSuccess?.();
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description:
                error?.response?.data?.message || "Failed to update task",
              variant: "destructive",
            });
          },
        }
      );
      return
    } else{
      createTask(
      {
        projectId: String(projectId),
        dto: {
          title: formData.title,
          description: formData.description,
          state: formData.state,
          startDate: formData.startDate,
          endDate: formData.endDate,
          assignedUserIds: formData.assignedUsers,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Task created successfully.",
          });
          onSuccess?.();
          onOpenChange(false);
          // Reset form
          setFormData({
            title: "",
            description: "",
            state: TaskStatus.TODO,
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            assignedUsers: [],
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "Failed to create task",
            variant: "destructive",
          });
        },
      }
    );
    }
    
  };

  const toggleUser = (userId: number) => {
    setFormData((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter((id) => id !== userId)
        : [...prev.assignedUsers, userId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter task title"
              required
            />
          </div>
          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          {/* Task status */}     
          <div className="space-y-2">
            <Label htmlFor="state">Status</Label>
            <Select
              value={formData.state}
              onValueChange={(value: TaskDto["state"]) =>
                setFormData({ ...formData, state: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="INPROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Task date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>
          {/* Assigned members */}
          <div className="space-y-2">
            <Label>Assigned Members</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {projectUsers.map((projectUser) => (
                <div key={projectUser.user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${projectUser.user.id}`}
                    checked={formData.assignedUsers.includes(projectUser.user.id)}
                    onCheckedChange={() => toggleUser(projectUser.user.id)}
                  />
                  <label
                    htmlFor={`user-${projectUser.user.id}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {projectUser.user.name} ({projectUser.user.email})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{isEdit ? 'Update Task' : 'Create Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
