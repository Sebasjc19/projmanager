"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, List } from "lucide-react";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog";
import type { TaskDto } from "@/types/task.types";
import { useEffect } from "react";
import { useUserTasks } from "@/hooks/useUsers";
import { getUser } from "@/lib/auth";
import TaskCard from "@/components/tasks/task-card";

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  // useState hooks
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  //Data fetch
  const { data: userTasks = [], isLoading: isTasksLoading } = useUserTasks(
    String(getUser()?.id)
  );

  useEffect(() => {
    const taskId = searchParams.get("taskId");
    if (taskId) {
      const task = userTasks.find((t) => t.id === Number.parseInt(taskId));
      if (task) {
        setSelectedTask(task);
        setIsTaskDetailOpen(true);
      }
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="mt-2 text-muted-foreground">
            Organize and track your tasks
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <KanbanBoard
          searchQuery={searchQuery}
          userTasks={userTasks}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setIsTaskDetailOpen(true);
          }}
        />
      ) : (
        <>
          {userTasks.map((task) => {
            return (
              <TaskCard
                key={task.id}
                task={task}
                assignedUsers={task.assignedUsers}
              />
            );
          })}
        </>
      )}

      <TaskDetailDialog
        task={selectedTask}
        open={isTaskDetailOpen}
        onOpenChange={setIsTaskDetailOpen}
      />
    </div>
  );
}
