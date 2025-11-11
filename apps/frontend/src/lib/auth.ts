import { UserDto } from "@/types/user.types"

export function getToken(): string | null {
    if (typeof window === "undefined") return null

    try{
        const token = localStorage.getItem("token")
        if (!token || token === "undefined") {
            return null
        }
        return token
    } catch (error) {
        console.error("Error parsing token from localStorage:", error)
        localStorage.removeItem("token")
        return null
    }
}

export function setToken(token: string): void {
    localStorage.setItem("token", token)
}

export function removeToken(): void {
    localStorage.removeItem("token")
}

export function getUser(): UserDto | null {
    if (typeof window === "undefined") return null

    try {
        const user = localStorage.getItem("user")

        if (!user || user === "undefined") {
            return null
        }

        return JSON.parse(user)
    } catch (error) {
        console.error("Error parsing user from localStorage:", error)
        localStorage.removeItem("user")
        return null
    }
}

export function setUser(user: UserDto): void {
    localStorage.setItem("user", JSON.stringify(user))
}

export function removeUser(): void {
    localStorage.removeItem("user")
}

export function logout(): void {
    removeToken()
    removeUser()
}