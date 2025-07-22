import axios from "axios"
import { config } from "../util/config"
import { getStoredAccessToken } from "../util/authStorage"

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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

export const refreshTokenRequest = () => apiClient.post("/auth/refresh-token")

export const createRequestRetrier = (refreshTokenFn: () => Promise<boolean>) => {
  return async (error: any) => {
    const { config: originalRequest, response } = error

    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshSuccess = await refreshTokenFn()
        if (refreshSuccess) {
          // Retry the original request with new token
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
}

export default apiClient