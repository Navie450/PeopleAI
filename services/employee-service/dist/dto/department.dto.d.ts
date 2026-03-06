import { z } from 'zod';
export declare const createDepartmentSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
    manager_id: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    budget: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    description?: string | undefined;
    parent_id?: string | undefined;
    manager_id?: string | undefined;
    location?: string | undefined;
    budget?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    code: string;
    name: string;
    description?: string | undefined;
    parent_id?: string | undefined;
    manager_id?: string | undefined;
    location?: string | undefined;
    budget?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>;
export declare const updateDepartmentSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    parent_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    manager_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    budget: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    is_active: z.ZodOptional<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    parent_id?: string | null | undefined;
    manager_id?: string | null | undefined;
    location?: string | null | undefined;
    budget?: number | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    is_active?: boolean | undefined;
}, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    parent_id?: string | null | undefined;
    manager_id?: string | null | undefined;
    location?: string | null | undefined;
    budget?: number | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    is_active?: boolean | undefined;
}>;
export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>;
export declare const listDepartmentsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodBoolean>;
    include_children: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    include_children: boolean;
    search?: string | undefined;
    parent_id?: string | undefined;
    is_active?: boolean | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    parent_id?: string | undefined;
    is_active?: boolean | undefined;
    page?: number | undefined;
    include_children?: boolean | undefined;
}>;
export type ListDepartmentsQuery = z.infer<typeof listDepartmentsQuerySchema>;
export interface DepartmentListItemResponse {
    id: string;
    name: string;
    code: string;
    description?: string;
    parent_id?: string;
    parent_name?: string;
    manager_id?: string;
    manager_name?: string;
    location?: string;
    employee_count?: number;
    is_active: boolean;
    created_at: Date;
}
export interface DepartmentDetailResponse extends DepartmentListItemResponse {
    budget?: number;
    children?: DepartmentListItemResponse[];
    metadata?: Record<string, unknown>;
    updated_at: Date;
}
export interface DepartmentHierarchy {
    id: string;
    name: string;
    code: string;
    children?: DepartmentHierarchy[];
}
//# sourceMappingURL=department.dto.d.ts.map