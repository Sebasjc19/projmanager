import { getToken } from "@/lib/auth"

const API_URL = process.env.API_URL || "http://localhost:8080"

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  
  const headers = new Headers({
    "Content-Type": "application/json",
    ...options.headers,
  })
  
  const token = getToken()
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(url, {
    headers,
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || `Error: ${response.status}`)
  }

  return response.json()
}
