export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_PERMISSIONS = {
  // General
  DASHBOARD: ['admin', 'manager', 'user'],
  PROFILE: ['admin', 'manager', 'user'],

  // Employee Portal (Self-Service)
  EMPLOYEE_PORTAL: ['admin', 'manager', 'user'],
  MY_LEAVE: ['admin', 'manager', 'user'],
  MY_GOALS: ['admin', 'manager', 'user'],
  TEAM_DIRECTORY: ['admin', 'manager', 'user'],
  ANNOUNCEMENTS: ['admin', 'manager', 'user'],

  // Admin Features
  ANNOUNCEMENTS_MANAGE: ['admin'],
  LEAVE_APPROVAL: ['admin', 'manager'],

  // Existing permissions
  EMPLOYEES: ['admin', 'manager'],
  DEPARTMENTS: ['admin', 'manager'],
  USERS: ['admin'],
  SECURITY: ['admin'],
  SETTINGS: ['admin'],
} as const

export type Permission = keyof typeof ROLE_PERMISSIONS
