import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader, refreshTokenRequest } from "../services/ApiClient"
import router from "../router"
import type { User } from "../types/User"
import { getStoredAccessToken, getStoredUser, storeAuthData, clearAuthData } from "../util/authStorage"

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!getStoredAccessToken())
  const [accessToken, setAccessToken] = useState<string>(getStoredAccessToken())
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(getStoredUser())

  const handleRefreshToken = async () => {
    try {
      const result = await refreshTokenRequest()
      const { accessToken, user } = result.data
      storeAuthData(accessToken, user)
      setAccessToken(accessToken)
      setUser(user)
      setIsLoggedIn(true)
      return true
    } catch (error) {
      clearAuthData()
      setAccessToken("")
      setUser(null)
      setIsLoggedIn(false)
      return false
    }
  }

  // Set up axios interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          const refreshSuccess = await handleRefreshToken()
          
          if (refreshSuccess) {
            return apiClient(originalRequest)
          }
          
          // Handle failed refresh based on current path
          const currentPath = window.location.pathname
          if (currentPath.startsWith('/admin')) {
            router.navigate("/admin/login")
          } else {
            router.navigate("/login")
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      apiClient.interceptors.response.eject(interceptor)
    }
  }, [])

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
        const userData = getStoredUser()
        setUser(userData)
        setIsLoggedIn(true)

        // Handle navigation based on user role and current path
        const currentPath = window.location.pathname
        if (currentPath === "/login" || currentPath === "/signup" || currentPath === "/") {
          // If user is admin and on login page, redirect to admin dashboard
          if (userData?.role === 'admin') {
            router.navigate("/admin")
          } else {
            router.navigate("/dashboard")
          }
        } else if (currentPath.startsWith('/admin') && userData?.role !== 'admin') {
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