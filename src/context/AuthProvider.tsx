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
      const { accessToken, user } = result.data
      if (!accessToken) {
        throw new Error('No access token received')
      }
      storeAuthData(accessToken, user || getStoredUser())
      setHeader(accessToken)
      dispatch({ type: 'SET_AUTH_DATA', payload: { token: accessToken, user: user || getStoredUser() } })
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
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
      try {
        const currentToken = getStoredAccessToken();
        const userData = getStoredUser();
        
        if (!currentToken || !userData) {
          dispatch({ type: 'CLEAR_AUTH_DATA' });
          return;
        }

        if (!isTokenExpired(currentToken)) {
          dispatch({ type: 'SET_AUTH_DATA', payload: { token: currentToken, user: userData } });
          setHeader(currentToken);
          handleNavigation(window.location.pathname, userData?.role);
          return;
        }

        await tryRefresh();
      } catch (error) {
        console.error('Auth initialization failed:', error);
        dispatch({ type: 'CLEAR_AUTH_DATA' });
      } finally {
        dispatch({ type: 'SET_AUTHENTICATING', payload: false });
      }
    };

    initializeAuth();
  }, [])

  const tryRefresh = async () => {
    try {
      const result = await refreshTokenRequest()
      const { accessToken, user: newUserData } = result.data
      const userData = newUserData || getStoredUser()
      
      if (!accessToken || !userData) {
        throw new Error('Invalid refresh response')
      }

      storeAuthData(accessToken, userData)
      setHeader(accessToken)
      dispatch({ type: 'SET_AUTH_DATA', payload: { token: accessToken, user: userData } })
      handleNavigation(window.location.pathname, userData?.role)
    } catch (error) {
      console.error('Token refresh failed:', error)
      clearAuthData()
      dispatch({ type: 'CLEAR_AUTH_DATA' })
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
        router.navigate("/admin/login")
      } else if (currentPath !== '/login' && currentPath !== '/signup') {
        router.navigate("/login")
      }
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