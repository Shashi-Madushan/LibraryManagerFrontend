import type { User } from '../types/User'

const ACCESS_TOKEN_KEY = 'access_token'
const USER_KEY = 'user'

export const getStoredAccessToken = (): string => {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || ''
}

export const getStoredUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  } catch (error) {
    console.error('Error parsing stored user:', error)
    return null
  }
}

export const storeAuthData = (accessToken: string, user: User): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearAuthData = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
