export interface ProjectDto {
    id: number
    title: string
    description: string
    startDate: string
    endDate: string
    status: ProjectStatus
}

export interface CreateProjectDto {
    title: string
    description: string
    startDate: string
    endDate: string
}

export interface UpdateProjectDto {
    title?: string
    description?: string
    startDate?: string
    endDate?: string
}

export enum ProjectStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}