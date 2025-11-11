"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ProjectDto, ProjectStatus } from "@/types/project.types";
import { useUserProjects, useUserTasks } from "@/hooks/useUsers";
import { useAuth } from "@/contexts/auth-context";
import { useMemo } from "react";
import { useProjectsTasksData, useProjectsUsersData } from "@/hooks/useProjects";
import { TaskDto, TaskStatus } from "@/types/task.types";

const createStats = (projects: ProjectDto[], userTasks: TaskDto[], teamMembers: number) => [
  {
    title: "Total Projects",
    value: projects.length.toString(),
    icon: FolderKanban,
    color: "text-primary",
  },
  {
    title: "Active Tasks",
    value: userTasks
      .filter((t) => t.state !== TaskStatus.DONE)
      .length.toString(),
    icon: CheckSquare,
    color: "text-accent",
  },
  {
    title: "Team Members",
    value: teamMembers.toString(),
    icon: Users,
    color: "text-chart-2",
  },
  {
    title: "Completion Rate",
    value:
      userTasks.length > 0
        ? `${Math.round((userTasks.filter((t) => t.state === TaskStatus.DONE).length / userTasks.length) * 100)}%`
        : "0%",
    icon: TrendingUp,
    color: "text-chart-3",
  },
];

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: userProjects = [], isLoading: projectsLoading } =
    useUserProjects(user?.id ? String(user?.id) : "");
  const { data: userTasks = [], isLoading: isTasksLoading } = useUserTasks(
    String(user?.id)
  );

  const projects = userProjects.map((up) => up.project);
  const activeProjects = projects
    .filter((p) => p.status === ProjectStatus.ACTIVE)
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 4);

  const { tasksData, isLoading: tasksLoading } = useProjectsTasksData(
    activeProjects.map((p) => p.id)
  )
  const { users, isLoading: usersLoading } = useProjectsUsersData(
    activeProjects.map((p) => p.id)
);

  const recentProjects = useMemo(() => {
    if (!activeProjects.length) return [];

    return activeProjects.map((project, index) => {
      const projectTasks = tasksData[index]?.data || [];
      const completedTasks = projectTasks.filter(
        (t: any) => t.state === TaskStatus.DONE
      ).length;
      const totalTasks = projectTasks.length;
      const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const daysUntilDue = Math.ceil(
        (new Date(project.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return {
        id: project.id,
        name: project.title,
        progress,
        tasks: { completed: completedTasks, total: totalTasks },
        status: daysUntilDue < 3 ? "at-risk" : "on-track",
        dueDate:
          daysUntilDue === 0
            ? "Today"
            : daysUntilDue === 1
              ? "Tomorrow"
              : `${daysUntilDue} days`,
      };
    });
  }, [activeProjects, tasksData]);

  const upcomingDeadlines = useMemo(() => {
    return userTasks
      .filter((task: any) => task.state !== TaskStatus.DONE)
      .sort(
        (a: any, b: any) =>
          new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      )
      .slice(0, 4)
      .map((task: any) => {
        const project = projects.find((p) => p.id === task.projectId);
        const daysUntilDue = Math.ceil(
          (new Date(task.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );

        return {
          project: project?.title || "Unknown Project",
          task: task.title,
          dueDate:
            daysUntilDue === 0
              ? "Today"
              : daysUntilDue === 1
                ? "Tomorrow"
                : `In ${daysUntilDue} days`,
          priority:
            daysUntilDue < 3 ? "high" : daysUntilDue < 7 ? "medium" : "low",
        };
      });
  }, [userTasks, projects]);

  const stats = useMemo(
    () => createStats(projects, userTasks, users.length),
    [projects, userTasks, users]
  );

  const isLoading =
    authLoading ||
    projectsLoading ||
    isTasksLoading

  if (isLoading) {
    return <h1>loading</h1>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Overview of your projects and team activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/*<p className="text-xs text-muted-foreground">{stat.change}</p>*/}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Track progress on your active projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentProjects.map((project) => (
              <div key={project.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {project.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {project.tasks.completed} of {project.tasks.total} tasks
                      completed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        project.status === "at-risk"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {project.status === "at-risk" ? "At Risk" : "On Track"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.progress}%</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due in {project.dueDate}
                    </span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity 
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    {activity.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        */}
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>
            Tasks and milestones requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      deadline.priority === "high"
                        ? "bg-destructive/10"
                        : deadline.priority === "medium"
                          ? "bg-accent/10"
                          : "bg-muted"
                    }`}
                  >
                    <AlertCircle
                      className={`h-5 w-5 ${
                        deadline.priority === "high"
                          ? "text-destructive"
                          : deadline.priority === "medium"
                            ? "text-accent"
                            : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{deadline.task}</p>
                    <p className="text-xs text-muted-foreground">
                      {deadline.project}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      deadline.priority === "high"
                        ? "destructive"
                        : deadline.priority === "medium"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {deadline.priority}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {deadline.dueDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
