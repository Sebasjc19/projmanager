import { AuthResponse } from "@/types/auth.types"
import { api } from "@/lib/api"

export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password })
    return response.data
}