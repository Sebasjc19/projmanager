import { User } from "@/lib/auth"

export interface AuthResponse {
    access_token: string
    user: User
}
