import { apiClient } from './client'
import type {
  ApiResponse,
  Employee,
  EmployeeListItem,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ListEmployeesQuery,
  BulkUpdateEmployeesDto,
  TransferEmployeeDto,
  PromoteEmployeeDto,
  TerminateEmployeeDto,
  EmployeeAnalytics,
  OrgChartNode,
  Skill,
  PerformanceGoal,
  EmergencyContact,
} from '@/types'

export const employeesApi = {
  // List employees with pagination and filters
  list: (params?: ListEmployeesQuery) =>
    apiClient.get<ApiResponse<EmployeeListItem[]>>('/employees', { params }),

  // Get employee by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Employee>>(`/employees/${id}`),

  // Get current user's employee profile
  getMyProfile: () =>
    apiClient.get<ApiResponse<Employee>>('/employees/me'),

  // Get employee by user ID
  getByUserId: (userId: string) =>
    apiClient.get<ApiResponse<Employee>>(`/employees/user/${userId}`),

  // Create employee
  create: (data: CreateEmployeeDto) =>
    apiClient.post<ApiResponse<Employee>>('/employees', data),

  // Update employee
  update: (id: string, data: UpdateEmployeeDto) =>
    apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data),

  // Delete employee (soft delete)
  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/employees/${id}`),

  // Bulk update employees
  bulkUpdate: (data: BulkUpdateEmployeesDto) =>
    apiClient.post<ApiResponse<{ updated: number; failed: string[] }>>('/employees/bulk-update', data),

  // Transfer employee to different department
  transfer: (id: string, data: TransferEmployeeDto) =>
    apiClient.post<ApiResponse<Employee>>(`/employees/${id}/transfer`, data),

  // Promote employee
  promote: (id: string, data: PromoteEmployeeDto) =>
    apiClient.post<ApiResponse<Employee>>(`/employees/${id}/promote`, data),

  // Terminate employee
  terminate: (id: string, data: TerminateEmployeeDto) =>
    apiClient.post<ApiResponse<Employee>>(`/employees/${id}/terminate`, data),

  // Get direct reports
  getDirectReports: (id: string) =>
    apiClient.get<ApiResponse<EmployeeListItem[]>>(`/employees/${id}/direct-reports`),

  // Get org chart
  getOrgChart: (rootId?: string) =>
    apiClient.get<ApiResponse<OrgChartNode[]>>('/employees/org-chart', {
      params: rootId ? { rootId } : undefined,
    }),

  // Get analytics
  getAnalytics: () =>
    apiClient.get<ApiResponse<EmployeeAnalytics>>('/employees/analytics'),

  // Search employees
  search: (query: string, limit?: number) =>
    apiClient.get<ApiResponse<EmployeeListItem[]>>('/employees/search', {
      params: { q: query, limit },
    }),

  // Get employees by skill
  getBySkill: (skill: string, minLevel?: string) =>
    apiClient.get<ApiResponse<EmployeeListItem[]>>('/employees/by-skill', {
      params: { skill, minLevel },
    }),

  // Update skills
  updateSkills: (id: string, skills: Skill[]) =>
    apiClient.put<ApiResponse<Employee>>(`/employees/${id}/skills`, { skills }),

  // Update leave balance
  updateLeaveBalance: (
    id: string,
    leaveType: string,
    balance: {
      total_days?: number
      used_days?: number
      pending_days?: number
      carry_forward_days?: number
    }
  ) =>
    apiClient.put<ApiResponse<Employee>>(`/employees/${id}/leave-balance`, {
      leave_type: leaveType,
      ...balance,
    }),

  // Add performance goal
  addPerformanceGoal: (
    id: string,
    goal: Omit<PerformanceGoal, 'id' | 'created_at' | 'updated_at'>
  ) =>
    apiClient.post<ApiResponse<Employee>>(`/employees/${id}/goals`, goal),

  // Update performance goal
  updatePerformanceGoal: (
    id: string,
    goalId: string,
    updates: Partial<PerformanceGoal>
  ) =>
    apiClient.put<ApiResponse<Employee>>(`/employees/${id}/goals/${goalId}`, updates),

  // ============================================
  // SELF-SERVICE ENDPOINTS
  // ============================================

  // Update own contact info
  updateMyContactInfo: (data: {
    personal_email?: string
    personal_phone?: string
    address_line1?: string
    address_line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }) =>
    apiClient.put<ApiResponse<Employee>>('/employees/me/contact-info', data),

  // Update own emergency contacts
  updateMyEmergencyContacts: (emergency_contacts: EmergencyContact[]) =>
    apiClient.put<ApiResponse<Employee>>('/employees/me/emergency-contacts', { emergency_contacts }),

  // Update own goal progress
  updateMyGoalProgress: (
    goalId: string,
    updates: { progress_percentage?: number; status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled' }
  ) =>
    apiClient.put<ApiResponse<Employee>>(`/employees/me/goals/${goalId}/progress`, updates),
}
