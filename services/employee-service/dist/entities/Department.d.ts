export declare class Department {
    id: string;
    name: string;
    code: string;
    description?: string;
    parent_id?: string;
    parent?: Department;
    children?: Department[];
    manager_id?: string;
    location?: string;
    budget?: number;
    metadata?: Record<string, unknown>;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
//# sourceMappingURL=Department.d.ts.map