import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader } from "../services/ApiClient"
import router from "../router"
import type { User } from "../types/User"

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string>("")
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  const login = (token: string, userData: User) => {
    setIsLoggedIn(true)
    setAccessToken(token)
    setUser(userData)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setAccessToken("")
  }

  useEffect(() => {
    setHeader(accessToken)
  }, [accessToken])

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        // Try to refresh the token
        const result = await apiClient.post("/auth/refresh-token")
        setAccessToken(result.data.accessToken)
        
        // Fetch user data
        const userResponse = await apiClient.get("/users/me")
        const userData = userResponse.data
        setUser(userData)
        setIsLoggedIn(true)

        // Handle navigation based on user role and current path
        const currentPath = window.location.pathname
        if (currentPath === "/login" || currentPath === "/signup" || currentPath === "/") {
          // If user is admin and on login page, redirect to admin dashboard
          if (userData.role === 'admin') {
            router.navigate("/admin")
          } else {
            router.navigate("/dashboard")
          }
        } else if (currentPath.startsWith('/admin') && userData.role !== 'admin') {
          // If user is not admin but trying to access admin pages
          router.navigate("/dashboard")
        }
      } catch (error) {
        setAccessToken("")
        setUser(null)
        setIsLoggedIn(false)
        
        // Handle failed refresh based on current path
        const currentPath = window.location.pathname
        if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
          router.navigate("/admin/login")
        } else if (currentPath !== '/login' && currentPath !== '/signup') {
          router.navigate("/login")
        }
      } finally {
        setIsAuthenticating(false)
      }
    }

    tryRefresh()
  }, [])

  return <AuthContext.Provider value={{ isLoggedIn, login, logout, isAuthenticating, user }}>{children}</AuthContext.Provider>
}