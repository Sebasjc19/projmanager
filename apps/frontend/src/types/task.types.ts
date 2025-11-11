import { UserDto } from "./user.types"

export interface TaskDto {
    id: number
    title: string
    description: string
    state: TaskStatus
    startDate: string
    endDate: string
    projectId: number
    assignedUsers: UserDto[]
}

export interface CreateTaskDto {
    title: string
    description: string
    state?: TaskStatus
    startDate: string
    endDate: string
    assignedUserIds: number[]
}

export interface UpdateTaskDto {
    title?: string
    description?: string
    state?: TaskStatus
    startDate?: string
    endDate?: string
    assignedUserIds?: number[]
}

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'INPROGRESS',
    DONE = 'DONE'
}