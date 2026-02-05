import { apiClient } from './client'
import type {
  ApiResponse,
  LeaveRequest,
  LeaveRequestListItem,
  CreateLeaveRequestDto,
  ReviewLeaveRequestDto,
  ListLeaveRequestsQuery,
  LeaveBalanceSummary,
  TeamLeaveSummary,
} from '@/types'

export const leaveRequestsApi = {
  // ============================================
  // SELF-SERVICE ENDPOINTS
  // ============================================

  // Get current user's leave requests
  getMyLeaveRequests: (params?: ListLeaveRequestsQuery) =>
    apiClient.get<ApiResponse<LeaveRequestListItem[]>>('/leave-requests/my', { params }),

  // Get current user's leave balances
  getMyLeaveBalances: () =>
    apiClient.get<ApiResponse<LeaveBalanceSummary[]>>('/leave-requests/my/balances'),

  // Create new leave request
  create: (data: CreateLeaveRequestDto) =>
    apiClient.post<ApiResponse<LeaveRequest>>('/leave-requests', data),

  // Cancel own pending leave request
  cancel: (id: string) =>
    apiClient.put<ApiResponse<LeaveRequest>>(`/leave-requests/${id}/cancel`),

  // ============================================
  // MANAGER ENDPOINTS
  // ============================================

  // Get team's leave requests
  getTeamLeaveRequests: (params?: ListLeaveRequestsQuery) =>
    apiClient.get<ApiResponse<LeaveRequestListItem[]>>('/leave-requests/team', { params }),

  // Get team leave summary
  getTeamLeaveSummary: () =>
    apiClient.get<ApiResponse<TeamLeaveSummary>>('/leave-requests/team/summary'),

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  // List all leave requests
  list: (params?: ListLeaveRequestsQuery) =>
    apiClient.get<ApiResponse<LeaveRequestListItem[]>>('/leave-requests', { params }),

  // Get leave request by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<LeaveRequest>>(`/leave-requests/${id}`),

  // Approve leave request
  approve: (id: string, data?: ReviewLeaveRequestDto) =>
    apiClient.put<ApiResponse<LeaveRequest>>(`/leave-requests/${id}/approve`, data || {}),

  // Reject leave request
  reject: (id: string, data?: ReviewLeaveRequestDto) =>
    apiClient.put<ApiResponse<LeaveRequest>>(`/leave-requests/${id}/reject`, data || {}),
}
