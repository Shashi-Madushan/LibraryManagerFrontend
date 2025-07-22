import { useEffect, useReducer } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader, refreshTokenRequest, createRequestRetrier } from "../services/ApiClient"
import router from "../router"
import type { User } from "../types/User"
import { getStoredAccessToken, getStoredUser, storeAuthData, clearAuthData } from "../util/authStorage"
import { isTokenExpired } from "../util/tokenUtils"

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string;
  isAuthenticating: boolean;
  user: User | null;
}

type AuthAction =
  | { type: 'SET_AUTH_DATA'; payload: { token: string; user: User | null } }
  | { type: 'CLEAR_AUTH_DATA' }
  | { type: 'SET_AUTHENTICATING'; payload: boolean }

const initialState: AuthState = {
  isLoggedIn: !!getStoredAccessToken(),
  accessToken: getStoredAccessToken(),
  isAuthenticating: true,
  user: getStoredUser()
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_AUTH_DATA':
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.payload.token,
        user: action.payload.user
      }
    case 'CLEAR_AUTH_DATA':
      return {
        ...state,
        isLoggedIn: false,
        accessToken: '',
        user: null
      }
    case 'SET_AUTHENTICATING':
      return {
        ...state,
        isAuthenticating: action.payload
      }
    default:
      return state
  }
}

const handleNavigation = (currentPath: string, userRole?: string) => {
  if (currentPath === "/login" || currentPath === "/signup" || currentPath === "/") {
    router.navigate(userRole === 'admin' ? "/admin" : "/dashboard")
  } else if (currentPath.startsWith('/admin')) {
    if (!userRole || userRole !== 'admin') {
      router.navigate("/dashboard")
    }
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const handleRefreshToken = async () => {
    try {
      const result = await refreshTokenRequest()
      // Update to handle the correct response structure
      const accessToken = result.data.accessToken
      const user = getStoredUser() // Keep existing user data
      storeAuthData(accessToken, user )
      setHeader(accessToken)
      dispatch({ type: 'SET_AUTH_DATA', payload: { token: accessToken, user } })
      return true
    } catch (error) {
      clearAuthData()
      dispatch({ type: 'CLEAR_AUTH_DATA' })
      return false
    }
  }

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
        response => response,
        createRequestRetrier(handleRefreshToken)
    );
    return () => apiClient.interceptors.response.eject(interceptor);
  }, [])

  useEffect(() => {
    setHeader(state.accessToken)
  }, [state.accessToken])

  useEffect(() => {
    const initializeAuth = async () => {
      const currentToken = getStoredAccessToken();
      const userData = getStoredUser();
      
      if (!currentToken || !userData) {
        dispatch({ type: 'CLEAR_AUTH_DATA' });
        dispatch({ type: 'SET_AUTHENTICATING', payload: false });
        return;
      }

      if (!isTokenExpired(currentToken)) {
        // Token is still valid, just set the auth data
        dispatch({ type: 'SET_AUTH_DATA', payload: { token: currentToken, user: userData } });
        handleNavigation(window.location.pathname, userData?.role);
        dispatch({ type: 'SET_AUTHENTICATING', payload: false });
        return;
      }

      // Only try refresh if token is expired
      tryRefresh();
    };

    initializeAuth();
  }, [])

  const tryRefresh = async () => {
    try {
      const result = await apiClient.post("/auth/refresh-token")
      const userData = getStoredUser()
      if (userData) {
        const accessToken = result.data.accessToken
        dispatch({ type: 'SET_AUTH_DATA', payload: { token: accessToken, user: userData } })
        handleNavigation(window.location.pathname, userData?.role)
      } else {
        dispatch({ type: 'CLEAR_AUTH_DATA' })
      }
    } catch (error) {
      dispatch({ type: 'CLEAR_AUTH_DATA' })
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
        router.navigate("/admin/login")
      } else if (currentPath !== '/login' && currentPath !== '/signup') {
        router.navigate("/login")
      }
    } finally {
      dispatch({ type: 'SET_AUTHENTICATING', payload: false })
    }
  }

  const login = (token: string, userData: User) => {
    storeAuthData(token, userData)
    dispatch({ type: 'SET_AUTH_DATA', payload: { token, user: userData } })
  }

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthData()
      dispatch({ type: 'CLEAR_AUTH_DATA' })
    }
  }

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn: state.isLoggedIn, 
      login, 
      logout, 
      isAuthenticating: state.isAuthenticating, 
      user: state.user 
    }}>
      {children}
    </AuthContext.Provider>
  )
}