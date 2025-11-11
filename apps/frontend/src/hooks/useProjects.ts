import { addUserToProject, createProject, createTask, deleteProject, deleteTask, getProject, getProjectTasks, getProjectUsers, getTask, removeUserFromProject, updateProject, updateTask, updateUserRole } from '@/services/projects.service'
import { ProjectDto, UpdateProjectDto } from '@/types/project.types'
import { CreateUserProjectDto, UpdateUserProjectDto } from '@/types/userproject.types'
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query'
import { CreateTaskDto, UpdateTaskDto } from '@/types/task.types'

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  tasks: (projectId: string) => [...projectKeys.all, projectId, 'tasks'] as const,
  taskDetail: (projectId: string, taskId: string) => [...projectKeys.tasks(projectId), taskId] as const,
  users: (projectId: string) => [...projectKeys.all, projectId, 'users'] as const,
}

// Hooks

// ----- Project -----

export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalidate and refetch project list
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, dto }: { projectId: string; dto: UpdateProjectDto }) =>
      updateProject(projectId, dto),
    onSuccess: (updatedUser: ProjectDto) => {
      queryClient.setQueryData(
        projectKeys.detail(String(updatedUser.id)),
        updatedUser
      )
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    }
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, deletedId) => {
      // Remove the user from the cache
      queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) })
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['users'] })

    }
  })
}

// ----- Task -----

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, dto}: { projectId: string; dto: CreateTaskDto}) =>
      createTask(projectId, dto),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.tasks(projectId) })
    }
  })
}

export const useTask = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: projectKeys.taskDetail(projectId, taskId),
    queryFn: () => getTask(projectId, taskId),
    enabled: !!projectId && !!taskId
  })
}

export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.tasks(projectId),
    queryFn: () => getProjectTasks(projectId),
    enabled: !!projectId
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, taskId, dto }: { projectId: string; taskId: string; dto: UpdateTaskDto }) =>
      updateTask(projectId, taskId, dto),
    onSuccess: (_, { projectId, taskId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.taskDetail(projectId, taskId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.tasks(projectId) })
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, taskId }: { projectId: string; taskId: string }) =>
      deleteTask(projectId, taskId),
    onSuccess: (_, { projectId, taskId }) => {
      queryClient.removeQueries({ queryKey: projectKeys.taskDetail(projectId, taskId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.tasks(projectId) })
    },
  })
}


// ----- User -----
export const useAddUserProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, dto}: { projectId: string; dto: CreateUserProjectDto}) =>
      addUserToProject(projectId, dto),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.users(projectId) })
    }
  })
}

export const useProjectUsers = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.users(projectId),
    queryFn: () => getProjectUsers(projectId),
    enabled: !!projectId
  })
}

export const useUpdateProjectUserRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, userId, dto }: { projectId: string; userId: string; dto: UpdateUserProjectDto }) =>
      updateUserRole(projectId, userId, dto),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.users(projectId) })
    }
  })
}

export const useDeleteProjectUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({projectId, userId}: { projectId: string; userId: string}) => 
      removeUserFromProject(projectId, userId),
    onSuccess: (_, { projectId }) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: projectKeys.users(projectId)})
    }
  })
}


//

export const useProjectsTasksData = (projectIds: number[]) => {
  const projectTasksQueries = useQueries({
    queries: projectIds.map((projectId) => ({
      queryKey: projectKeys.tasks(String(projectId)),
      queryFn: () => getProjectTasks(String(projectId)),
      enabled: !!projectId,
    })),
  });

  // Transformar y agregar los datos
  const tasksData = projectTasksQueries.map((query) => ({
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  }));

  const isLoading = projectTasksQueries.some((q) => q.isLoading);
  const isError = projectTasksQueries.some((q) => q.isError);

  return { tasksData, isLoading, isError };
};

export const useProjectsUsersData = (projectIds: number[]) => {
  const projectUsersQueries = useQueries({
    queries: projectIds.map((projectId) => ({
      queryKey: projectKeys.users(String(projectId)),
      queryFn: () => getProjectUsers(String(projectId)),
      enabled: !!projectId,
    })),
  });

  // Deduplicar usuarios (pueden estar en múltiples proyectos)
  const allUsers = projectUsersQueries
    .flatMap((query) => query.data || [])
    .reduce((unique, user) => {
      const exists = unique.find((u) => u.userId === user.user.id);
      return exists ? unique : [...unique, user];
    }, [] as any[]);

  const isLoading = projectUsersQueries.some((q) => q.isLoading);
  const isError = projectUsersQueries.some((q) => q.isError);

  return { users: allUsers, isLoading, isError };
};