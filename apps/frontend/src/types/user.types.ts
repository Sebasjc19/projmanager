export interface UserDto {
    id: number
    email: string
    name: string
}

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface CreateUserDto{
    name: string
    email: string
    password: string
}

export interface UpdateUserDto{
    name?: string
    email?: string
    password?: string
}

export interface UpdateUserDto{
    email?: string
    name?: string
    password?: string
}