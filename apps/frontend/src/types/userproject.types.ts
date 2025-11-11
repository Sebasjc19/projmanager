import { ProjectDto } from "./project.types"
import { UserDto } from "./user.types"

export interface UserProjectDto {
  user: number,
  project: number,
  role: UserRole
}

export interface CreateUserProjectDto {
  email: string,
  role: UserRole
}

export interface UpdateUserProjectDto {
  role: UserRole
}

export interface ProjectUserWithDetailsResponseDto{
  userProject: any
  project: number
  user: UserDto
  role: UserRole
}

export interface UserProjectWithDetailsResponseDto {
  user: number
  project: ProjectDto
  role: UserRole
}


export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}