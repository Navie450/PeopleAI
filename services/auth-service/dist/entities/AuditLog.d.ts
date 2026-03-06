import { User } from './User';
export declare class AuditLog {
    id: string;
    user_id?: string;
    action: string;
    resource_type: string;
    resource_id?: string;
    changes?: Record<string, unknown>;
    ip_address?: string;
    user_agent?: string;
    created_at: Date;
    user?: User;
}
//# sourceMappingURL=AuditLog.d.ts.map