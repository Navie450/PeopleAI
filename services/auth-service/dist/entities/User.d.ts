import { UserRole } from './UserRole';
export declare class User {
    id: string;
    email: string;
    password_hash: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    phone?: string;
    is_active: boolean;
    email_verified: boolean;
    metadata?: Record<string, unknown>;
    last_login_at?: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    user_roles?: UserRole[];
    roles?: string[];
}
//# sourceMappingURL=User.d.ts.map