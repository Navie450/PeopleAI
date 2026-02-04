import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface RoleProtectedRouteProps {
  allowedRoles: string[]
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles }) => {
  const { hasAnyRole } = useAuth()

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
