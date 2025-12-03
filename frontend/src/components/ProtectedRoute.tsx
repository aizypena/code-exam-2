import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth()

  // Wait for authentication check to complete
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

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
