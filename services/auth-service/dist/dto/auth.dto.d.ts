import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    first_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    first_name?: string | undefined;
    last_name?: string | undefined;
}, {
    email: string;
    password: string;
    first_name?: string | undefined;
    last_name?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refresh_token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refresh_token: string;
}, {
    refresh_token: string;
}>;
export declare const changePasswordSchema: z.ZodObject<{
    old_password: z.ZodString;
    new_password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    old_password: string;
    new_password: string;
}, {
    old_password: string;
    new_password: string;
}>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export interface AuthTokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
}
export interface UserResponse {
    id: string;
    email: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    roles: string[];
    is_active: boolean;
    email_verified: boolean;
    last_login_at?: Date;
    created_at: Date;
}
//# sourceMappingURL=auth.dto.d.ts.map