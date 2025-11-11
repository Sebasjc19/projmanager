import { createUser, deleteUser, getUser, getUserProjects, getUserTasks, updateUser } from '@/services/users.service'
import { UpdateUserDto, UserDto } from '@/types/user.types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  projects: (userId: string) => [...userKeys.all, userId, 'projects'] as const,
  tasks: (userId: string) => [...userKeys.all, userId, 'tasks'] as const,
}

// Hooks

// ----- User -----

export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: !!id
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, dto }: { userId: string; dto: UpdateUserDto }) =>
      updateUser(userId, dto),
    onSuccess: (updatedUser: UserDto) => {
      // Update the user in the cache
      queryClient.setQueryData(userKeys.detail(String(updatedUser.id)), updatedUser)
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedId) => {
      // Remove the user from the cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) })
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}

// ----- Project -----

export const useUserProjects = (userId: string) => {
  return useQuery({
    queryKey: userKeys.projects(userId),
    queryFn: () => getUserProjects (userId),
    enabled: !!userId
  })
}

// ----- Task -----

export const useUserTasks = (userId: string) => {
  return useQuery({
    queryKey: userKeys.tasks(userId),
    queryFn: () => getUserTasks (userId),
    enabled: !!userId
  })
}

// ----- Extra -----

