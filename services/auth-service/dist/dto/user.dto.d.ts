import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    username: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    display_name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    email: string;
    roles?: string[] | undefined;
    username?: string | undefined;
    first_name?: string | undefined;
    last_name?: string | undefined;
    display_name?: string | undefined;
    phone?: string | undefined;
    password?: string | undefined;
}, {
    email: string;
    roles?: string[] | undefined;
    username?: string | undefined;
    first_name?: string | undefined;
    last_name?: string | undefined;
    display_name?: string | undefined;
    phone?: string | undefined;
    password?: string | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    display_name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    username?: string | undefined;
    first_name?: string | undefined;
    last_name?: string | undefined;
    display_name?: string | undefined;
    phone?: string | undefined;
    is_active?: boolean | undefined;
}, {
    email?: string | undefined;
    username?: string | undefined;
    first_name?: string | undefined;
    last_name?: string | undefined;
    display_name?: string | undefined;
    phone?: string | undefined;
    is_active?: boolean | undefined;
}>;
export declare const assignRoleSchema: z.ZodObject<{
    role_name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role_name: string;
}, {
    role_name: string;
}>;
export declare const listUsersQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    search: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    search?: string | undefined;
    role?: string | undefined;
    is_active?: boolean | undefined;
    page?: number | undefined;
}, {
    limit?: string | undefined;
    search?: string | undefined;
    role?: string | undefined;
    is_active?: string | undefined;
    page?: string | undefined;
}>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type AssignRoleDto = z.infer<typeof assignRoleSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export interface UserDetailResponse {
    id: string;
    email: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    phone?: string;
    roles: Array<{
        id: string;
        name: string;
        description?: string;
    }>;
    is_active: boolean;
    email_verified: boolean;
    last_login_at?: Date;
    created_at: Date;
    updated_at: Date;
}
export interface UserListItemResponse {
    id: string;
    email: string;
    username?: string;
    display_name?: string;
    roles: string[];
    is_active: boolean;
    last_login_at?: Date;
    created_at: Date;
}
//# sourceMappingURL=user.dto.d.ts.map