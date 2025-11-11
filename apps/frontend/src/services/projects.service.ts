import { CreateTaskDto, TaskDto, UpdateTaskDto } from "@/types/task.types"
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from "@/types/project.types"
import { CreateUserProjectDto, ProjectUserWithDetailsResponseDto, UpdateUserProjectDto, UserProjectDto } from "@/types/userproject.types"
import { api } from "@/lib/api"

// ----- Projects -----

export async function getProject(
  projectId: string
): Promise<ProjectDto> {
  const response = await api.get<ProjectDto>(`/projects/${projectId}`)
  return response.data
}

export async function createProject(
  dto: CreateProjectDto
): Promise<ProjectDto> {
  const response = await api.post<ProjectDto>('/projects', dto)
  return response.data
}

export async function updateProject(
  projectId: string,
  dto: UpdateProjectDto
): Promise<ProjectDto> {
  const response = await api.patch<ProjectDto>(`/projects/${projectId}`, dto)
  return response.data
}

export async function deleteProject(
  projectId: string
): Promise<void> {
  await api.delete<void>(`/projects/${projectId}`)
}

// ----- Tasks -----

export async function createTask(
  projectId: string,
  dto: CreateTaskDto
): Promise<TaskDto> {
  const response = await api.post<TaskDto>(
    `/projects/${projectId}/tasks`,
    dto
  )
  return response.data
}

export async function getTask(
  projectId: string,
  taskId: string
): Promise<TaskDto> {
  const response = await api.get<TaskDto>(
    `/projects/${projectId}/tasks/${taskId}`
  )
  return response.data
}

export async function getProjectTasks(projectId: string): Promise<TaskDto[]> {
    const response = await api.get<TaskDto[]>(`/projects/${projectId}/tasks`)
    return response.data
}

export async function updateTask(
  projectId: string,
  taskId: string,
  dto: UpdateTaskDto
): Promise<TaskDto> {
  const response = await api.patch<TaskDto>(
    `/projects/${projectId}/tasks/${taskId}`,
    dto
  )
  return response.data
}

export async function deleteTask(
  projectId: string,
  taskId: string
): Promise<void> {
  await api.delete<void>(`/projects/${projectId}/tasks/${taskId}`)  
}

// ----- User project relations -----

export async function addUserToProject(
  projectId: string,
  dto: CreateUserProjectDto
): Promise<UserProjectDto> {
  const response = await api.post<UserProjectDto>(
    `/projects/${projectId}/users`,
    dto
  )
  return response.data
}

export async function getProjectUsers(
  projectId: string
): Promise<ProjectUserWithDetailsResponseDto[]> {
  const response = await api.get<ProjectUserWithDetailsResponseDto[]>(
    `/projects/${projectId}/users`
  )
  return response.data
}

export async function updateUserRole(
  projectId: string,
  userId: string,
  dto: UpdateUserProjectDto
): Promise<UserProjectDto> {
  const response = await api.patch<UserProjectDto>(
    `/projects/${projectId}/users/${userId}`,
    dto
  )
  return response.data
}

export async function removeUserFromProject(
  projectId: string,
  userId: string
): Promise<void> {
  await api.delete<void>(`/projects/${projectId}/users/${userId}` )
}