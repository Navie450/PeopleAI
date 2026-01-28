import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

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
