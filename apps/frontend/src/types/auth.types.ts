import { User } from "@/types/user.types"

export interface AuthResponse {
    access_token: string
    user: User
}
