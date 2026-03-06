import { Role } from '../entities/Role';
import { CreateUserDto, UpdateUserDto, ListUsersQuery, UserDetailResponse, UserListItemResponse } from '../dto/user.dto';
import { PaginationMeta } from '../types';
declare class UserService {
    listUsers(query: ListUsersQuery): Promise<{
        users: UserListItemResponse[];
        meta: PaginationMeta;
    }>;
    getUserById(userId: string): Promise<UserDetailResponse>;
    createUser(userData: CreateUserDto, createdBy?: string): Promise<UserDetailResponse>;
    updateUser(userId: string, userData: UpdateUserDto, updatedBy?: string): Promise<UserDetailResponse>;
    deleteUser(userId: string, deletedBy?: string): Promise<void>;
    activateUser(userId: string, activatedBy?: string): Promise<UserDetailResponse>;
    deactivateUser(userId: string, deactivatedBy?: string): Promise<UserDetailResponse>;
    getUserRoles(userId: string): Promise<Role[]>;
    assignRole(userId: string, roleName: string, assignedBy?: string): Promise<void>;
    removeRole(userId: string, roleId: string, removedBy?: string): Promise<void>;
    private assignRoles;
    private createAuditLog;
    private mapToUserDetailResponse;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=user.service.d.ts.map