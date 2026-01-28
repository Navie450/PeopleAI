import { apiClient } from './client'
import type { ApiResponse, User, CreateUserDto, UpdateUserDto, ListUsersQuery, Role } from '@/types'

export const usersApi = {
  // List users with pagination
  list: (params?: ListUsersQuery) =>
    apiClient.get<ApiResponse<User[]>>('/users', { params }),

  // Get user by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  // Create user
  create: (data: CreateUserDto) =>
    apiClient.post<ApiResponse<User>>('/users', data),

  // Update user
  update: (id: string, data: UpdateUserDto) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data),

  // Delete user
  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}`),

  // Activate user
  activate: (id: string) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/activate`),

  // Deactivate user
  deactivate: (id: string) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/deactivate`),

  // Get user roles
  getRoles: (id: string) =>
    apiClient.get<ApiResponse<Role[]>>(`/users/${id}/roles`),

  // Assign role
  assignRole: (id: string, roleName: string) =>
    apiClient.post<ApiResponse<void>>(`/users/${id}/roles`, { role_name: roleName }),

  // Remove role
  removeRole: (id: string, roleId: string) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}/roles/${roleId}`),

  // Get current user (authenticated endpoint)
  getCurrentUser: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),

  // Logout
  logout: () =>
    apiClient.post<ApiResponse<void>>('/auth/logout')
}
