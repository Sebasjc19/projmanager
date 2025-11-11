"use client";
import { Calendar, CheckSquare, Users } from "lucide-react";
import { Badge } from "./badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Progress } from "./progress";
import { useProjectTasks, useProjectUsers } from "@/hooks/useProjects";
import { ProjectDto, ProjectStatus } from "@/types/project.types";
import { useRouter } from "next/navigation";

const statusLabels: Record<ProjectDto["status"], string> = {
  PLANNED: "Planned",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

interface ProjectCardProps {
  project: ProjectDto;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { data: tasks = [], isLoading: tasksLoading } = useProjectTasks(String(project.id));
  const { data: userProjects = [], isLoading: usersLoading } = useProjectUsers(String(project.id));
  const router = useRouter();

  const completedTasks = tasks.filter((t) => t.state === "DONE").length;
  const progress =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  if (tasksLoading || usersLoading) {
    return (
      <Card className="flex flex-col cursor-pointer transition-all opacity-50">
        <CardHeader>
          <CardTitle className="text-lg">{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      key={project.id}
      className="flex flex-col cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <Badge
              variant={
                project.status === ProjectStatus.ACTIVE
                  ? "default"
                  : project.status === ProjectStatus.COMPLETED
                    ? "secondary"
                    : "outline"
              }
            >
              {statusLabels[project.status]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckSquare className="h-4 w-4" />
            <span>
              {completedTasks}/{tasks.length} tasks
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{userProjects.length} members</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Due {new Date(project.endDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
