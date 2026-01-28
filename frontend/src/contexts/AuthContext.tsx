import React, { createContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '@/api/auth.api'
import { storage } from '@/utils/storage'
import { env } from '@/config/env'
import type { User } from '@/types'
import type { LoginRequest, RegisterRequest } from '@/api/auth.api'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest, rememberMe?: boolean) => Promise<User>
  register: (data: RegisterRequest) => Promise<User>
  logout: () => Promise<void>
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = storage.getUser()
      const accessToken = storage.getAccessToken()

      if (storedUser && accessToken) {
        try {
          // Verify token is still valid by fetching current user
          const { data } = await authApi.getCurrentUser()
          setUser(data.data!)
          storage.setUser(data.data!)
        } catch (error) {
          // Token invalid, clear storage
          storage.clearTokens()
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = useCallback(async (credentials: LoginRequest, rememberMe: boolean = false): Promise<User> => {
    const { data } = await authApi.login(credentials)
    const { tokens, user: userData } = data.data!

    // Store tokens and user with remember me preference
    storage.setAccessToken(tokens.access_token, rememberMe)
    if (tokens.refresh_token) {
      storage.setRefreshToken(tokens.refresh_token)
    }
    storage.setUser(userData)

    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (registerData: RegisterRequest): Promise<User> => {
    const { data } = await authApi.register(registerData)
    const { tokens, user: userData } = data.data!

    // Store tokens and user
    storage.setAccessToken(tokens.access_token)
    if (tokens.refresh_token) {
      storage.setRefreshToken(tokens.refresh_token)
    }
    storage.setUser(userData)

    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Even if logout fails, clear local storage
      console.error('Logout error:', error)
    } finally {
      storage.clearTokens()
      setUser(null)
      window.location.href = '/login'
    }
  }, [])

  const hasRole = useCallback(
    (role: string) => {
      return user?.user_roles?.some((ur) => ur.role.role_name === role) ?? false
    },
    [user]
  )

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return roles.some((role) =>
        user?.user_roles?.some((ur) => ur.role.role_name === role)
      ) ?? false
    },
    [user]
  )

  // Automatic logout on inactivity
  useEffect(() => {
    if (!user) return

    let timeout: ReturnType<typeof setTimeout>

    const resetTimer = () => {
      clearTimeout(timeout)
      timeout = setTimeout(
        () => {
          logout()
        },
        env.VITE_SESSION_TIMEOUT_MINUTES * 60 * 1000
      )
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => {
      document.addEventListener(event, resetTimer)
    })

    resetTimer()

    return () => {
      clearTimeout(timeout)
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer)
      })
    }
  }, [user, logout])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
