import { AuthResponse } from "@/types/auth.types"
import { apiCall } from "./api"
import { BackendResponse } from "@/types/api.types"

export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiCall<BackendResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    })
    return {
        access_token: response.data.access_token,
        user: response.data.user,
    }
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await apiCall<BackendResponse>(`/auth/register`, {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
    })
    return response.data
}