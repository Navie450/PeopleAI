import { z } from 'zod';
import { LeaveRequestStatus, LeaveType } from '../entities/LeaveRequest';

// Helpers
const emptyToUndefined = (val: unknown) => (val === '' ? undefined : val);
const optionalString = z.preprocess(emptyToUndefined, z.string().optional());

// Create Leave Request Schema
export const createLeaveRequestSchema = z.object({
  leave_type: z.nativeEnum(LeaveType),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  total_days: z.number().min(0.5, 'Total days must be at least 0.5'),
  reason: optionalString,
});

export type CreateLeaveRequestDto = z.infer<typeof createLeaveRequestSchema>;

// Update Leave Request Schema (for cancellation or editing pending requests)
export const updateLeaveRequestSchema = z.object({
  leave_type: z.nativeEnum(LeaveType).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  total_days: z.number().min(0.5).optional(),
  reason: optionalString,
});

export type UpdateLeaveRequestDto = z.infer<typeof updateLeaveRequestSchema>;

// Review Leave Request Schema (for approve/reject)
export const reviewLeaveRequestSchema = z.object({
  reviewer_comments: optionalString,
});

export type ReviewLeaveRequestDto = z.infer<typeof reviewLeaveRequestSchema>;

// List Leave Requests Query Schema
export const listLeaveRequestsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  employee_id: z.string().uuid().optional(),
  leave_type: z.nativeEnum(LeaveType).optional(),
  status: z.nativeEnum(LeaveRequestStatus).optional(),
  start_date_from: z.string().optional(),
  start_date_to: z.string().optional(),
  sort_by: z.enum(['created_at', 'start_date', 'total_days', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export type ListLeaveRequestsQuery = z.infer<typeof listLeaveRequestsQuerySchema>;

// Response Interfaces
export interface LeaveRequestListItemResponse {
  id: string;
  employee_id: string;
  employee?: {
    id: string;
    full_name: string;
    employee_id: string;
    department?: {
      id: string;
      name: string;
    };
  };
  leave_type: LeaveType;
  start_date: Date;
  end_date: Date;
  total_days: number;
  reason?: string;
  status: LeaveRequestStatus;
  reviewed_by?: string;
  reviewer?: {
    id: string;
    full_name: string;
  };
  reviewed_at?: Date;
  reviewer_comments?: string;
  created_at: Date;
  updated_at: Date;
}

export interface LeaveRequestDetailResponse extends LeaveRequestListItemResponse {
  // Additional fields can be added here if needed
}

// Leave Balance Response (for employee self-service)
export interface LeaveBalanceSummary {
  leave_type: string;
  total_days: number;
  used_days: number;
  pending_days: number;
  available_days: number;
  carry_forward_days: number;
}

// Team Leave Summary Response
export interface TeamLeaveSummary {
  pending_requests: number;
  upcoming_leaves: Array<{
    employee_id: string;
    employee_name: string;
    leave_type: LeaveType;
    start_date: Date;
    end_date: Date;
    total_days: number;
  }>;
  on_leave_today: Array<{
    employee_id: string;
    employee_name: string;
    leave_type: LeaveType;
    end_date: Date;
  }>;
}
