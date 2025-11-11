"use client";

import { Calendar, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { TaskDto, TaskStatus } from "@/types/task.types";
import { UserDto } from "@/types/user.types";
import { TaskDetailDialog } from "./task-detail-dialog";
import { useState } from "react";

const taskStateLabels: Record<string, string> = {
  TODO: "TODO",
  INPROGRESS: "IN PROGRESS",
  DONE: "DONE",
};

interface TaskCardProps {
  task: TaskDto;
  assignedUsers: UserDto[];
  onTaskClick?: (task: TaskDto) => void;
}

export default function TaskCard({ task, assignedUsers }: TaskCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  return (
    <div>

      <Card
        className="hover:bg-accent/50 transition-colors cursor-pointer"
        onClick={() => {
          setSelectedTask(task);
          setIsDetailOpen(true);
        }}
      >
        <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium">{task.title}</h3>
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
            <p className="text-sm text-muted-foreground">{task.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {assignedUsers.map((u) => u.name).join(", ") || "Unassigned"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(task.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskDetailDialog
        task={selectedTask}
        open={isDetailOpen}
        assignedUsers={assignedUsers}
        onOpenChange={setIsDetailOpen}
      />

    </div>
  );
}
