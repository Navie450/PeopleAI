import { z } from 'zod';
import { LeaveRequestStatus, LeaveType } from '../entities/LeaveRequest';
export declare const createLeaveRequestSchema: z.ZodObject<{
    leave_type: z.ZodNativeEnum<typeof LeaveType>;
    start_date: z.ZodString;
    end_date: z.ZodString;
    total_days: z.ZodNumber;
    reason: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
}, "strip", z.ZodTypeAny, {
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    total_days: number;
    reason?: string | undefined;
}, {
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    total_days: number;
    reason?: unknown;
}>;
export type CreateLeaveRequestDto = z.infer<typeof createLeaveRequestSchema>;
export declare const updateLeaveRequestSchema: z.ZodObject<{
    leave_type: z.ZodOptional<z.ZodNativeEnum<typeof LeaveType>>;
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodString>;
    total_days: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
}, "strip", z.ZodTypeAny, {
    leave_type?: LeaveType | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    total_days?: number | undefined;
    reason?: string | undefined;
}, {
    leave_type?: LeaveType | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    total_days?: number | undefined;
    reason?: unknown;
}>;
export type UpdateLeaveRequestDto = z.infer<typeof updateLeaveRequestSchema>;
export declare const reviewLeaveRequestSchema: z.ZodObject<{
    reviewer_comments: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
}, "strip", z.ZodTypeAny, {
    reviewer_comments?: string | undefined;
}, {
    reviewer_comments?: unknown;
}>;
export type ReviewLeaveRequestDto = z.infer<typeof reviewLeaveRequestSchema>;
export declare const listLeaveRequestsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    employee_id: z.ZodOptional<z.ZodString>;
    leave_type: z.ZodOptional<z.ZodNativeEnum<typeof LeaveType>>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof LeaveRequestStatus>>;
    start_date_from: z.ZodOptional<z.ZodString>;
    start_date_to: z.ZodOptional<z.ZodString>;
    sort_by: z.ZodDefault<z.ZodEnum<["created_at", "start_date", "total_days", "status"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sort_by: "status" | "created_at" | "start_date" | "total_days";
    sort_order: "asc" | "desc";
    status?: LeaveRequestStatus | undefined;
    employee_id?: string | undefined;
    leave_type?: LeaveType | undefined;
    start_date_from?: string | undefined;
    start_date_to?: string | undefined;
}, {
    status?: LeaveRequestStatus | undefined;
    limit?: number | undefined;
    employee_id?: string | undefined;
    leave_type?: LeaveType | undefined;
    page?: number | undefined;
    sort_by?: "status" | "created_at" | "start_date" | "total_days" | undefined;
    sort_order?: "asc" | "desc" | undefined;
    start_date_from?: string | undefined;
    start_date_to?: string | undefined;
}>;
export type ListLeaveRequestsQuery = z.infer<typeof listLeaveRequestsQuerySchema>;
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
}
export interface LeaveBalanceSummary {
    leave_type: string;
    total_days: number;
    used_days: number;
    pending_days: number;
    available_days: number;
    carry_forward_days: number;
}
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
//# sourceMappingURL=leave-request.dto.d.ts.map