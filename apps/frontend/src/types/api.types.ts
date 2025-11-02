import { User } from "./user.types"

export interface BackendResponse {
    status: number
    message: string
    data: {
        access_token: string
        user: User
    }
    timestamp: string
}