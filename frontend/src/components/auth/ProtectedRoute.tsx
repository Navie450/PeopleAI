import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { CircularProgress, Box } from '@mui/material'

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
