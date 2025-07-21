import axios, { AxiosError } from "axios"
import { config } from "../util/config"

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // cookies -> refresh token
})

/// Authorization: "Bearer asdkjasldkja"
export const setHeader = (accessToken: string) => {
  if (accessToken !== "") {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
  } else {
    delete apiClient.defaults.headers.common["Authorization"]
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Only try to refresh if it's a 403 error and we haven't tried refreshing yet
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const result = await apiClient.post("/auth/refresh-token")
        const newAccessToken = result.data.accessToken
        setHeader(newAccessToken)
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
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