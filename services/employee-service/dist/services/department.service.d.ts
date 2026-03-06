import { CreateDepartmentDto, UpdateDepartmentDto, ListDepartmentsQuery, DepartmentListItemResponse, DepartmentDetailResponse, DepartmentHierarchy } from '../dto/department.dto';
import { PaginationMeta } from '../types';
declare class DepartmentService {
    listDepartments(query: ListDepartmentsQuery): Promise<{
        departments: DepartmentListItemResponse[];
        meta: PaginationMeta;
    }>;
    getDepartmentById(departmentId: string): Promise<DepartmentDetailResponse>;
    createDepartment(departmentData: CreateDepartmentDto, createdBy?: string): Promise<DepartmentDetailResponse>;
    updateDepartment(departmentId: string, departmentData: UpdateDepartmentDto, updatedBy?: string): Promise<DepartmentDetailResponse>;
    deleteDepartment(departmentId: string, deletedBy?: string): Promise<void>;
    getDepartmentHierarchy(): Promise<DepartmentHierarchy[]>;
    getDepartmentEmployees(departmentId: string): Promise<{
        department: DepartmentListItemResponse;
        employees: Array<{
            id: string;
            employee_id: string;
            full_name: string;
            job_title: string;
            work_email: string;
        }>;
    }>;
    private createAuditLog;
}
export declare const departmentService: DepartmentService;
export {};
//# sourceMappingURL=department.service.d.ts.map