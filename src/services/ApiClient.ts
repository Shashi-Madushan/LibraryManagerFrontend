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

export const createRequestRetrier = (refreshTokenFn: () => Promise<string | null>) => {
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
  }> = [];

  const processQueue = (error: any = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });
    failedQueue = [];
  };

  return async (error: any) => {
    const { config: originalRequest, response } = error;

    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        try {
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          // Update the token in the retried request
          const newToken = getStoredAccessToken();
          if (newToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      isRefreshing = true;

      try {
        const newToken = await refreshTokenFn();
        processQueue();
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  };
}

export default apiClient