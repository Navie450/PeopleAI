import { CreateLeaveRequestDto, ReviewLeaveRequestDto, ListLeaveRequestsQuery, LeaveRequestListItemResponse, LeaveRequestDetailResponse, LeaveBalanceSummary, TeamLeaveSummary } from '../dto/leave-request.dto';
import { PaginationMeta } from '../types';
declare class LeaveRequestService {
    getMyLeaveRequests(userId: string, query: ListLeaveRequestsQuery): Promise<{
        leaveRequests: LeaveRequestListItemResponse[];
        meta: PaginationMeta;
    }>;
    listLeaveRequests(query: ListLeaveRequestsQuery): Promise<{
        leaveRequests: LeaveRequestListItemResponse[];
        meta: PaginationMeta;
    }>;
    getTeamLeaveRequests(managerId: string, query: ListLeaveRequestsQuery): Promise<{
        leaveRequests: LeaveRequestListItemResponse[];
        meta: PaginationMeta;
    }>;
    getLeaveRequestById(id: string): Promise<LeaveRequestDetailResponse>;
    createLeaveRequest(userId: string, data: CreateLeaveRequestDto): Promise<LeaveRequestDetailResponse>;
    cancelLeaveRequest(id: string, userId: string): Promise<LeaveRequestDetailResponse>;
    approveLeaveRequest(id: string, reviewerId: string, data?: ReviewLeaveRequestDto): Promise<LeaveRequestDetailResponse>;
    rejectLeaveRequest(id: string, reviewerId: string, data?: ReviewLeaveRequestDto): Promise<LeaveRequestDetailResponse>;
    getMyLeaveBalances(userId: string): Promise<LeaveBalanceSummary[]>;
    getTeamLeaveSummary(managerId: string): Promise<TeamLeaveSummary>;
    private createAuditLog;
    private mapToListItemResponse;
    private mapToDetailResponse;
}
export declare const leaveRequestService: LeaveRequestService;
export {};
//# sourceMappingURL=leave-request.service.d.ts.map