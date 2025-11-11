import { UserProjectWithDetailsResponseDto } from "@/types/userproject.types"
import { TaskDto } from "@/types/task.types"
import { api } from "@/lib/api"
import { CreateUserDto, UpdateUserDto, UserDto } from "@/types/user.types"


// ----- Users -----

export async function createUser(
    dto: CreateUserDto
): Promise<UserDto> {
    const response = await api.post<UserDto>('/users', dto)
    return response.data
}

export async function getUser(
    userId: string
): Promise<UserDto> {
    const response = await api.get<UserDto>(`/users/${userId}`)
    return response.data
}

export async function updateUser(
    userId: string,
    dto: UpdateUserDto
): Promise<UserDto> {
    const response = await api.patch<UserDto>(`/users/${userId}`, dto)
    return response.data
}

export async function deleteUser(
    userId: string
): Promise<void> {
    await api.delete<void>(`/users/${userId}`)
}

// ----- Task relation -----

export async function getUserTasks(userId: string): Promise<TaskDto[]> {
    const response = await api.get<TaskDto[]>(`/users/${userId}/tasks`)
    return response.data
}

// ----- Project relation -----

export async function getUserProjects(userId: string): Promise<UserProjectWithDetailsResponseDto[]> {
    const respnse = await api.get<UserProjectWithDetailsResponseDto[]>(
        `/users/${userId}/projects`)
    return respnse.data
}

