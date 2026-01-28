import { apiClient } from './client'
import axios from 'axios'
import type { ApiResponse, User, AuthTokens } from '@/types'

// Use raw axios for public auth endpoints to avoid circular dependency
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface RegisterRequest {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  tokens: AuthTokens
  user: User
}

export const authApi = {
  // Register new user
  register: (data: RegisterRequest) =>
    authClient.post<ApiResponse<AuthResponse>>('/auth/register', data),

  // Login with email and password
  login: (data: LoginRequest) =>
    authClient.post<ApiResponse<AuthResponse>>('/auth/login', data),

  // Refresh access token (used by apiClient interceptor)
  refreshToken: (refreshToken: string) =>
    authClient.post<ApiResponse<{ tokens: AuthTokens }>>('/auth/refresh', {
      refresh_token: refreshToken
    }),

  // Get current user (requires auth token)
  getCurrentUser: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),

  // Logout
  logout: () =>
    apiClient.post<ApiResponse<void>>('/auth/logout'),

  // Change password
  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post<ApiResponse<void>>('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword
    })
}
