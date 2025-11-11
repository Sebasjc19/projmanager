"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, Edit, Trash2 } from "lucide-react";
import { TaskStatus, type TaskDto } from "@/types/task.types";
import { TaskDialog } from "./task-dialog";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { UserDto } from "@/types/user.types";
import { useDeleteTask } from "@/hooks/useProjects";
import { toast } from "@/hooks/use-toast";

const taskStateLabels = {
  TODO: "To Do",
  INPROGRESS: "In Progress",
  DONE: "Done",
};

interface TaskDetailDialogProps {
  task: TaskDto | null;
  open: boolean;
  assignedUsers?: UserDto[];
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TaskDetailDialog({
  task,
  open,
  assignedUsers = [],
  onOpenChange,
  onSuccess: onTaskUpdated,
}: TaskDetailDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  if (!task) return null;

  const handleDelete = () => {
    deleteTask(
      {
        projectId: String(task.projectId),
        taskId: String(task.id),
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Task deleted successfully.",
          });
          setIsDeleteDialogOpen(false);
          onOpenChange(false);
          onTaskUpdated?.();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "Failed to delete task",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <DialogTitle className="text-2xl">{task.title}</DialogTitle>
                <Badge
                  variant={
                    task.state === TaskStatus.DONE
                      ? "secondary"
                      : task.state === TaskStatus.IN_PROGRESS
                        ? "default"
                        : "outline"
                  }
                >
                  {taskStateLabels[task.state]}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-sm">{task.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </h3>
                <p className="text-sm">
                  {new Date(task.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date
                </h3>
                <p className="text-sm">
                  {new Date(task.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Assigned Members ({assignedUsers.length})
              </h3>
              <div className="space-y-2">
                {assignedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-accent/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/diverse-avatars.png" alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TaskDialog
        projectId={task.projectId}
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
}
