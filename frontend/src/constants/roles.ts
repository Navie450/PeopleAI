export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_PERMISSIONS = {
  DASHBOARD: ['admin', 'manager', 'user'],
  PROFILE: ['admin', 'manager', 'user'],
  EMPLOYEES: ['admin', 'manager'],
  DEPARTMENTS: ['admin', 'manager'],
  USERS: ['admin'],
  SECURITY: ['admin'],
  SETTINGS: ['admin'],
} as const

export type Permission = keyof typeof ROLE_PERMISSIONS
