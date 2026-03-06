import { UserRole } from './UserRole';
export declare class Role {
    id: string;
    name: string;
    zitadel_role_id?: string;
    description?: string;
    permissions?: Record<string, unknown>;
    created_at: Date;
    updated_at: Date;
    user_roles?: UserRole[];
}
//# sourceMappingURL=Role.d.ts.map