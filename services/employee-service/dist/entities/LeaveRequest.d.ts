import { Employee } from './Employee';
export declare enum LeaveRequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    CANCELLED = "cancelled"
}
export declare enum LeaveType {
    ANNUAL = "annual",
    SICK = "sick",
    PERSONAL = "personal",
    MATERNITY = "maternity",
    PATERNITY = "paternity",
    BEREAVEMENT = "bereavement",
    UNPAID = "unpaid",
    COMPENSATORY = "compensatory",
    OTHER = "other"
}
export declare class LeaveRequest {
    id: string;
    employee_id: string;
    employee?: Employee;
    leave_type: LeaveType;
    start_date: Date;
    end_date: Date;
    total_days: number;
    reason?: string;
    status: LeaveRequestStatus;
    reviewed_by?: string;
    reviewed_at?: Date;
    reviewer_comments?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
//# sourceMappingURL=LeaveRequest.d.ts.map