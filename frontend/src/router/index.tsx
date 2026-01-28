import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Login, Register, ForgotPassword } from '@/features/auth'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { UserList } from '@/features/users/UserList'
import { UserDetail } from '@/features/users/UserDetail'
import { UserForm } from '@/features/users/UserForm'
import { Security } from '@/features/security/Security'
import { Settings } from '@/features/settings/Settings'
import { Profile } from '@/features/profile/Profile'
import { AppLayout } from '@/components/layout/AppLayout'

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
          {
            path: '/',
            element: <Dashboard />
          },
          {
            path: '/dashboard',
            element: <Dashboard />
          },
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
          },
          {
            path: '/security',
            element: <Security />
          },
          {
            path: '/settings',
            element: <Settings />
          },
          {
            path: '/profile',
            element: <Profile />
          }
        ]
      }
    ]
  }
])
