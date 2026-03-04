import { apiClient } from './client'
import type {
  ApiResponse,
  Department,
  DepartmentListItem,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  ListDepartmentsQuery,
  DepartmentHierarchy,
  DepartmentEmployeesResponse,
} from '@/types'

export const departmentsApi = {
  // List departments with pagination
  list: (params?: ListDepartmentsQuery) =>
    apiClient.get<ApiResponse<DepartmentListItem[]>>('/departments', { params }),

  // Get department by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Department>>(`/departments/${id}`),

  // Create department
  create: (data: CreateDepartmentDto) =>
    apiClient.post<ApiResponse<Department>>('/departments', data),

  // Update department
  update: (id: string, data: UpdateDepartmentDto) =>
    apiClient.put<ApiResponse<Department>>(`/departments/${id}`, data),

  // Delete department
  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/departments/${id}`),

  // Get department hierarchy
  getHierarchy: () =>
    apiClient.get<ApiResponse<DepartmentHierarchy[]>>('/departments/hierarchy'),

  // Get employees in department
  getEmployees: (id: string) =>
    apiClient.get<ApiResponse<DepartmentEmployeesResponse>>(`/departments/${id}/employees`),
}
