"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckSquare,
  MoreVertical,
  Clock,
  CheckCircle2,
  Circle,
  Mail,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectStatus } from "@/types/project.types";
import { TaskStatus } from "@/types/task.types";
import {
  useDeleteProject,
  useDeleteProjectUser,
  useProject,
  useProjectTasks,
  useProjectUsers,
} from "@/hooks/useProjects";
import React from "react";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { toast } from "@/hooks/use-toast";
import { UserDto } from "@/types/user.types";
import { AddMemberDialog } from "@/components/projects/add-member-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserProjectDto } from "@/types/userproject.types";
import { ChangeRoleDialog } from "@/components/projects/change-role-dialog";
import { TaskDialog } from "@/components/tasks/task-dialog";
import TaskCard from "@/components/tasks/task-card";
import ProjectDetailLoading from "./loading";

const statusLabels: Record<string, string> = {
  PLANNED: "PLANNED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

const taskStateLabels: Record<string, string> = {
  TODO: "TODO",
  IN_PROGRESS: "IN PROGRESS",
  DONE: "DONE",
};

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number.parseInt(params.id as string);
  const [activeTab, setActiveTab] = useState("overview");

  //Project dialogs state
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  //Task dialogs state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  //Member dialogs state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<UserDto | null>(null);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{
    user: UserDto;
    role: UserProjectDto["role"];
  } | null>(null);

  //Data fetching
  const { data: project, isLoading: isProjectLoading } = useProject(
    String(projectId)
  );
  const { data: tasks = [] } = useProjectTasks(String(projectId));
  const { data: projectUsers = [] } = useProjectUsers(String(projectId));
  //TODO: Refactor inside component
  const { mutate: deleteProj, isPending: isDeleting } = useDeleteProject();
  const { mutate: deleteUser, isPending: isRemoving } = useDeleteProjectUser();

  if (isProjectLoading) {
    return <ProjectDetailLoading />;
  }
  //If project does not exist
  if (!project ) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  //Filter tasks by status
  const completedTasks = tasks.filter(
    (t) => t.state === TaskStatus.DONE
  ).length;
  const inProgressTasks = tasks.filter(
    (t) => t.state === TaskStatus.IN_PROGRESS
  ).length;
  const todoTasks = tasks.filter((t) => t.state === "TODO").length;
  const progress =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const handleDeleteProject = () => {
    deleteProj(String(projectId), {
      onSuccess: () => {
        router.push("/dashboard/projects");
      },
    });
    toast({
      title: "Success",
      description: `${project.title} has been deleted successfully.`,
    });
  };

  const handleConfirmRemoveMember = () => {
    if (memberToRemove) {
      deleteUser({
        projectId: String(projectId),
        userId: String(memberToRemove.id),
      });
      setIsRemoveMemberOpen(false);
      setMemberToRemove(null);
      toast({
        title: "Success",
        description: "User has been removed successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">{project.title}</h1>
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
          <p className="mt-2 text-muted-foreground">{project.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 bg-transparent"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditProjectOpen(true)}>
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setIsDeleteProjectOpen(true)}
              disabled={isDeleting}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* ----- OVERVIEW ----- */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.length}</div>
                <p className="text-xs text-muted-foreground">
                  {completedTasks} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectUsers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active contributors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due Date</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Date(project.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.ceil(
                    (new Date(project.endDate).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days remaining
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>Overall completion status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />
                    To Do
                  </div>
                  <div className="text-2xl font-bold">{todoTasks}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 text-yellow-500" />
                    In Progress
                  </div>
                  <div className="text-2xl font-bold">{inProgressTasks}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Completed
                  </div>
                  <div className="text-2xl font-bold">{completedTasks}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* ----- TASK ----- */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold">Project Tasks</h2>
            <Button onClick={() => setIsAddTaskOpen(true)}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => {
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  assignedUsers={task.assignedUsers}
                />
              );
            })}
          </div>

          {tasks.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <CheckSquare className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get started by creating your first task for this project.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        {/* ----- Members ----- */}
        <TabsContent value="members" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <Button onClick={() => setIsAddMemberOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {projectUsers.map((userProject) => {
              const user = userProject.user;

              if (!user) {
                return null;
              }

              return (
                <Card key={`${user.id}-${userProject.project}`}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1 min-w-0">
                      <h3 className="font-medium truncate">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {roleLabels[userProject.role] || userProject.role}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/*<DropdownMenuItem>View Profile</DropdownMenuItem>*/}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember({ user, role: userProject.role });
                            setIsChangeRoleOpen(true);
                          }}
                        >
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setMemberToRemove(user);
                            setIsRemoveMemberOpen(true);
                          }}
                          disabled={isRemoving}
                        >
                          {isRemoving ? "Removing..." : "Remove from Project"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {projectUsers.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No team members yet
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start building your team by adding members to this project.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Project dialogs */}
      <ProjectDialog
        open={isEditProjectOpen}
        onOpenChange={setIsEditProjectOpen}
        project={project}
      />

      <ConfirmDialog
        open={isDeleteProjectOpen}
        onOpenChange={setIsDeleteProjectOpen}
        title="Remove project"
        description={`Are you sure you want to delete ${project?.title}?`}
        onConfirm={handleDeleteProject}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Task dialogs */}
      <TaskDialog
        projectId={projectId}
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
      />
      {/* Member dialogs */}
      <AddMemberDialog
        projectId={projectId}
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
      />

      {selectedMember && (
        <ChangeRoleDialog
          user={selectedMember.user}
          currentRole={selectedMember.role}
          projectId={projectId}
          open={isChangeRoleOpen}
          onOpenChange={setIsChangeRoleOpen}
        />
      )}

      <ConfirmDialog
        open={isRemoveMemberOpen}
        onOpenChange={setIsRemoveMemberOpen}
        title="Remove Team Member"
        description={`Are you sure you want to remove ${memberToRemove?.name} from this project? They will lose access to all project resources.`}
        onConfirm={handleConfirmRemoveMember}
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  );
}
