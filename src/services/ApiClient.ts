import axios from "axios"
import { config } from "../util/config"
import { getStoredAccessToken, getStoredUser, storeAuthData, clearAuthData } from "../util/authStorage"

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // cookies -> refresh token
})

export const setHeader = (accessToken: string) => {
  if (accessToken !== "") {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
  } else {
    delete apiClient.defaults.headers.common["Authorization"]
  }
}

// Initialize headers from stored token
const storedToken = getStoredAccessToken()
if (storedToken) {
  setHeader(storedToken)
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Only try to refresh if it's a 403 error and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const result = await apiClient.post("/auth/refresh-token")
        const { accessToken, user } = result.data
        
        // Store the new token and user data
        storeAuthData(accessToken, user)
        setHeader(accessToken)
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Clear stored auth data on refresh failure
        clearAuthData()
        setHeader("")
        
        // If refresh token fails, redirect based on the current path
        const currentPath = window.location.pathname
        if (currentPath.startsWith('/admin')) {
          window.location.href = "/admin/login"
        } else {
          window.location.href = "/login"
        }
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient