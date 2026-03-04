import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute'
import { Login, Register, ForgotPassword } from '@/features/auth'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { UserList } from '@/features/users/UserList'
import { UserDetail } from '@/features/users/UserDetail'
import { UserForm } from '@/features/users/UserForm'
import { EmployeeList, EmployeeDetail, EmployeeForm, EmployeeDashboard, OrgChart } from '@/features/employees'
import { DepartmentList, DepartmentDetail, DepartmentForm } from '@/features/departments'
import { Security } from '@/features/security/Security'
import { Settings } from '@/features/settings/Settings'
import { Profile } from '@/features/profile/Profile'
import { AppLayout } from '@/components/layout/AppLayout'
import { ROLE_PERMISSIONS } from '@/constants/roles'
// Employee Portal imports
import {
  EmployeePortalDashboard,
  MyProfile,
  MyLeave,
  MyGoals,
  TeamDirectory,
  Announcements,
} from '@/features/employee-portal'
// Announcement Management imports
import {
  AnnouncementManagement,
  AnnouncementForm,
} from '@/features/announcements'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Routes accessible to all authenticated users
          {
            path: '/',
            element: <Dashboard />
          },
          {
            path: '/dashboard',
            element: <Dashboard />
          },
          {
            path: '/profile',
            element: <Profile />
          },
          // Employee Portal Routes (Self-Service)
          {
            element: <RoleProtectedRoute allowedRoles={[...ROLE_PERMISSIONS.EMPLOYEE_PORTAL]} />,
            children: [
              {
                path: '/my-dashboard',
                element: <EmployeePortalDashboard />
              },
              {
                path: '/my-profile',
                element: <MyProfile />
              },
              {
                path: '/my-leave',
                element: <MyLeave />
              },
              {
                path: '/my-goals',
                element: <MyGoals />
              },
              {
                path: '/team-directory',
                element: <TeamDirectory />
              },
              {
                path: '/announcements',
                element: <Announcements />
              },
            ]
          },
          // Announcement Management (Admin only)
          {
            element: <RoleProtectedRoute allowedRoles={[...ROLE_PERMISSIONS.ANNOUNCEMENTS_MANAGE]} />,
            children: [
              {
                path: '/announcements/manage',
                element: <AnnouncementManagement />
              },
              {
                path: '/announcements/new',
                element: <AnnouncementForm mode="create" />
              },
              {
                path: '/announcements/:id/edit',
                element: <AnnouncementForm mode="edit" />
              },
            ]
          },
          // Admin + Manager routes
          {
            element: <RoleProtectedRoute allowedRoles={[...ROLE_PERMISSIONS.EMPLOYEES]} />,
            children: [
              {
                path: '/employees',
                element: <EmployeeList />
              },
              {
                path: '/employees/analytics',
                element: <EmployeeDashboard />
              },
              {
                path: '/employees/org-chart',
                element: <OrgChart />
              },
              {
                path: '/employees/new',
                element: <EmployeeForm mode="create" />
              },
              {
                path: '/employees/:id',
                element: <EmployeeDetail />
              },
              {
                path: '/employees/:id/edit',
                element: <EmployeeForm mode="edit" />
              }
            ]
          },
          {
            element: <RoleProtectedRoute allowedRoles={[...ROLE_PERMISSIONS.DEPARTMENTS]} />,
            children: [
              {
                path: '/departments',
                element: <DepartmentList />
              },
              {
                path: '/departments/new',
                element: <DepartmentForm mode="create" />
              },
              {
                path: '/departments/:id',
                element: <DepartmentDetail />
              },
              {
                path: '/departments/:id/edit',
                element: <DepartmentForm mode="edit" />
              }
            ]
          },
          // Admin-only routes
          {
            element: <RoleProtectedRoute allowedRoles={[...ROLE_PERMISSIONS.USERS]} />,
            children: [
              {
                path: '/users',
                element: <UserList />
              },
              {
                path: '/users/:id',
                element: <UserDetail />
              },
              {
                path: '/users/new',
                element: <UserForm mode="create" />
              },
              {
                path: '/users/:id/edit',
                element: <UserForm mode="edit" />
              }
            ]
          },
          {
            element: <RoleProtectedRoute allowedRoles={[...ROLE_PERMISSIONS.SECURITY]} />,
            children: [
              {
                path: '/security',
                element: <Security />
              }
            ]
          },
          {
            element: <RoleProtectedRoute allowedRoles={[...ROLE_PERMISSIONS.SETTINGS]} />,
            children: [
              {
                path: '/settings',
                element: <Settings />
              }
            ]
          }
        ]
      }
    ]
  }
])
