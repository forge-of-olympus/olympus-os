
import { createContext, useContext, useState, type ReactNode } from "react"

export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role?: string
    [key: string]: any
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    loginWith2FA: (email: string, code: string) => Promise<void>
    logout: () => Promise<void>
    updateUser: (data: Partial<User>) => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    loginWith2FA: async () => { },
    logout: async () => { },
    updateUser: async () => { },
    refreshUser: async () => { },
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
    // Mock user
    const [user, setUser] = useState<User | null>({
        id: "mock-user-id",
        name: "Demo User",
        email: "demo@vistro.ai",
        role: "admin",
        avatar: "/avatars/01.png"
    })
    const [isLoading] = useState(false)

    // Mock functions that do nothing or log
    const loginWith2FA = async (email: string, code: string) => {
        console.log("Mock loginWith2FA called", email, code)
    }

    const logout = async () => {
        console.log("Mock logout called")
    }

    const updateUser = async (data: Partial<User>) => {
        console.log("Mock updateUser called", data)
        if (user) {
            setUser({ ...user, ...data })
        }
    }

    const refreshUser = async () => {
        console.log("Mock refreshUser called")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, loginWith2FA, logout, updateUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}
