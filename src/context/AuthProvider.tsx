import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader } from "../services/ApiClient"
import router from "../router"
import type { User } from "../types/User"
import { getStoredAccessToken, getStoredUser, storeAuthData, clearAuthData } from "../util/authStorage"

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!getStoredAccessToken())
  const [accessToken, setAccessToken] = useState<string>(getStoredAccessToken())
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(getStoredUser())

  const login = (token: string, userData: User) => {
    storeAuthData(token, userData)
    setIsLoggedIn(true)
    setAccessToken(token)
    setUser(userData)
  }

  const logout = () => {
    clearAuthData()
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