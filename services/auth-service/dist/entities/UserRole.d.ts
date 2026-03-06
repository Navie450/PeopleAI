import { User } from './User';
import { Role } from './Role';
export declare class UserRole {
    id: string;
    user_id: string;
    role_id: string;
    assigned_at: Date;
    assigned_by?: string;
    user: User;
    role: Role;
}
//# sourceMappingURL=UserRole.d.ts.map