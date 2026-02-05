// Leave Request Status
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

// Leave Type
export type LeaveType =
  | 'annual'
  | 'sick'
  | 'personal'
  | 'maternity'
  | 'paternity'
  | 'bereavement'
  | 'unpaid'
  | 'compensatory'
  | 'other'

// Leave Request Employee Info
export interface LeaveRequestEmployee {
  id: string
  full_name: string
  employee_id: string
  department?: {
    id: string
    name: string
  }
}

// Leave Request Reviewer Info
export interface LeaveRequestReviewer {
  id: string
  full_name: string
}

// Leave Request List Item
export interface LeaveRequestListItem {
  id: string
  employee_id: string
  employee?: LeaveRequestEmployee
  leave_type: LeaveType
  start_date: string
  end_date: string
  total_days: number
  reason?: string
  status: LeaveRequestStatus
  reviewed_by?: string
  reviewer?: LeaveRequestReviewer
  reviewed_at?: string
  reviewer_comments?: string
  created_at: string
  updated_at: string
}

// Leave Request Detail (extends list item if needed)
export interface LeaveRequest extends LeaveRequestListItem {}

// Create Leave Request DTO
export interface CreateLeaveRequestDto {
  leave_type: LeaveType
  start_date: string
  end_date: string
  total_days: number
  reason?: string
}

// Review Leave Request DTO
export interface ReviewLeaveRequestDto {
  reviewer_comments?: string
}

// List Leave Requests Query
export interface ListLeaveRequestsQuery {
  page?: number
  limit?: number
  employee_id?: string
  leave_type?: LeaveType
  status?: LeaveRequestStatus
  start_date_from?: string
  start_date_to?: string
  sort_by?: 'created_at' | 'start_date' | 'total_days' | 'status'
  sort_order?: 'asc' | 'desc'
}

// Leave Balance Summary
export interface LeaveBalanceSummary {
  leave_type: string
  total_days: number
  used_days: number
  pending_days: number
  available_days: number
  carry_forward_days: number
}

// Team Leave Summary
export interface TeamLeaveSummary {
  pending_requests: number
  upcoming_leaves: Array<{
    employee_id: string
    employee_name: string
    leave_type: LeaveType
    start_date: string
    end_date: string
    total_days: number
  }>
  on_leave_today: Array<{
    employee_id: string
    employee_name: string
    leave_type: LeaveType
    end_date: string
  }>
}

// Leave type display names
export const leaveTypeLabels: Record<LeaveType, string> = {
  annual: 'Annual Leave',
  sick: 'Sick Leave',
  personal: 'Personal Leave',
  maternity: 'Maternity Leave',
  paternity: 'Paternity Leave',
  bereavement: 'Bereavement Leave',
  unpaid: 'Unpaid Leave',
  compensatory: 'Compensatory Leave',
  other: 'Other',
}

// Leave status display names
export const leaveStatusLabels: Record<LeaveRequestStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
}

// Leave status colors for UI
export const leaveStatusColors: Record<LeaveRequestStatus, 'warning' | 'success' | 'error' | 'default'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  cancelled: 'default',
}
