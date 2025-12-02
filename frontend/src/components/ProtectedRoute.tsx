import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()

  // Not logged in - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check role if allowedRoles is specified
  if (allowedRoles && user && !allowedRoles.includes(user.role || '')) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
