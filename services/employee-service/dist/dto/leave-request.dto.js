"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLeaveRequestsQuerySchema = exports.reviewLeaveRequestSchema = exports.updateLeaveRequestSchema = exports.createLeaveRequestSchema = void 0;
const zod_1 = require("zod");
const LeaveRequest_1 = require("../entities/LeaveRequest");
// Helpers
const emptyToUndefined = (val) => (val === '' ? undefined : val);
const optionalString = zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional());
// Create Leave Request Schema
exports.createLeaveRequestSchema = zod_1.z.object({
    leave_type: zod_1.z.nativeEnum(LeaveRequest_1.LeaveType),
    start_date: zod_1.z.string().min(1, 'Start date is required'),
    end_date: zod_1.z.string().min(1, 'End date is required'),
    total_days: zod_1.z.number().min(0.5, 'Total days must be at least 0.5'),
    reason: optionalString,
});
// Update Leave Request Schema (for cancellation or editing pending requests)
exports.updateLeaveRequestSchema = zod_1.z.object({
    leave_type: zod_1.z.nativeEnum(LeaveRequest_1.LeaveType).optional(),
    start_date: zod_1.z.string().optional(),
    end_date: zod_1.z.string().optional(),
    total_days: zod_1.z.number().min(0.5).optional(),
    reason: optionalString,
});
// Review Leave Request Schema (for approve/reject)
exports.reviewLeaveRequestSchema = zod_1.z.object({
    reviewer_comments: optionalString,
});
// List Leave Requests Query Schema
exports.listLeaveRequestsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    employee_id: zod_1.z.string().uuid().optional(),
    leave_type: zod_1.z.nativeEnum(LeaveRequest_1.LeaveType).optional(),
    status: zod_1.z.nativeEnum(LeaveRequest_1.LeaveRequestStatus).optional(),
    start_date_from: zod_1.z.string().optional(),
    start_date_to: zod_1.z.string().optional(),
    sort_by: zod_1.z.enum(['created_at', 'start_date', 'total_days', 'status']).default('created_at'),
    sort_order: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=leave-request.dto.js.map