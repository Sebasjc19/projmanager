"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDto } from "@/types/project.types";
import { useAuth } from "@/contexts/auth-context";
import { useUserProjects } from "@/hooks/useUsers";
import ProjectCard from "@/components/ui/project-card";
import ProjectsLoading from "./loading";

const statusLabels: Record<ProjectDto["status"], string> = {
  PLANNED: "Planned",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | ProjectDto["status"]>(
    "all"
  );

  const { data: userProjects = [], isLoading: isProjectsLoading} = useUserProjects(String(user?.id));
  const projects = userProjects.map((up) => up.project);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || project.status === activeTab;
    return matchesSearch && matchesTab;
  });



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Manage and track all your projects
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as typeof activeTab)
        }
      >
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="ACTIVE">Active</TabsTrigger>
          <TabsTrigger value="PLANNED">Planned</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
        </TabsList>
        
        {isProjectsLoading ? (
          <>
          <ProjectsLoading/>
          </>
          
      ) : ( 
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {!isProjectsLoading && filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}
        </TabsContent>
        )}
        
      </Tabs>

      <ProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
