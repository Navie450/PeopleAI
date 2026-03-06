import { CreateEmployeeDto, UpdateEmployeeDto, ListEmployeesQuery, BulkUpdateEmployeesDto, TransferEmployeeDto, PromoteEmployeeDto, TerminateEmployeeDto, EmployeeListItemResponse, EmployeeDetailResponse, EmployeeAnalytics, OrgChartNode } from '../dto/employee.dto';
import { PaginationMeta } from '../types';
declare class EmployeeService {
    private generateEmployeeId;
    listEmployees(query: ListEmployeesQuery): Promise<{
        employees: EmployeeListItemResponse[];
        meta: PaginationMeta;
    }>;
    getEmployeeById(employeeId: string): Promise<EmployeeDetailResponse>;
    getEmployeeByUserId(userId: string): Promise<EmployeeDetailResponse>;
    createEmployee(employeeData: CreateEmployeeDto, createdBy?: string): Promise<EmployeeDetailResponse>;
    updateEmployee(employeeId: string, employeeData: UpdateEmployeeDto, updatedBy?: string): Promise<EmployeeDetailResponse>;
    deleteEmployee(employeeId: string, deletedBy?: string): Promise<void>;
    bulkUpdateEmployees(bulkData: BulkUpdateEmployeesDto, updatedBy?: string): Promise<{
        updated: number;
        failed: string[];
    }>;
    transferEmployee(employeeId: string, transferData: TransferEmployeeDto, transferredBy?: string): Promise<EmployeeDetailResponse>;
    promoteEmployee(employeeId: string, promoteData: PromoteEmployeeDto, promotedBy?: string): Promise<EmployeeDetailResponse>;
    terminateEmployee(employeeId: string, terminateData: TerminateEmployeeDto, terminatedBy?: string): Promise<EmployeeDetailResponse>;
    getDirectReports(managerId: string): Promise<EmployeeListItemResponse[]>;
    getOrgChart(rootEmployeeId?: string): Promise<OrgChartNode[]>;
    getAnalytics(): Promise<EmployeeAnalytics>;
    searchEmployees(searchTerm: string, limit?: number): Promise<EmployeeListItemResponse[]>;
    getEmployeesBySkill(skillName: string, minLevel?: string): Promise<EmployeeListItemResponse[]>;
    updateSkills(employeeId: string, skills: Array<{
        name: string;
        level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
        years_of_experience?: number;
        certified?: boolean;
    }>, updatedBy?: string): Promise<EmployeeDetailResponse>;
    updateLeaveBalance(employeeId: string, leaveType: string, balanceUpdate: {
        total_days?: number;
        used_days?: number;
        pending_days?: number;
        carry_forward_days?: number;
    }, updatedBy?: string): Promise<EmployeeDetailResponse>;
    addPerformanceGoal(employeeId: string, goal: {
        title: string;
        description: string;
        target_date: string;
        status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
        progress_percentage?: number;
    }, addedBy?: string): Promise<EmployeeDetailResponse>;
    updatePerformanceGoal(employeeId: string, goalId: string, updates: {
        title?: string;
        description?: string;
        target_date?: string;
        status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
        progress_percentage?: number;
    }, updatedBy?: string): Promise<EmployeeDetailResponse>;
    private createAuditLog;
    private mapToListItemResponse;
    private mapToDetailResponse;
}
export declare const employeeService: EmployeeService;
export {};
//# sourceMappingURL=employee.service.d.ts.map