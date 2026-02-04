export interface Role {
  id: string
  role_name: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  role: Role
  assigned_at: string
  assigned_by?: string
}

export interface User {
  id: string
  email: string
  password_hash?: string
  first_name?: string
  last_name?: string
  phone?: string
  is_active: boolean
  roles?: string[]
  user_roles?: UserRole[]
  created_at: string
  updated_at?: string
  last_login_at?: string
}

export interface CreateUserDto {
  email: string
  password: string
  first_name?: string
  last_name?: string
  phone?: string
}

export interface UpdateUserDto {
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
  is_active?: boolean
}

export interface ListUsersQuery {
  page?: number
  limit?: number
  search?: string
  role?: string
  is_active?: boolean
}
