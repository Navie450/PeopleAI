import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  display_name: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  roles: z.array(z.string()).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  display_name: z.string().optional(),
  phone: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const assignRoleSchema = z.object({
  role_name: z.string().min(1, 'Role name is required'),
});

export const listUsersQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
  role: z.string().optional(),
  is_active: z.string().transform((val) => val === 'true').optional(),
});

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
