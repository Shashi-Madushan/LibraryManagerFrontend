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

export default apiClient