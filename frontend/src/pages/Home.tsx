import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user, isAuthenticated, logout, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect admin users to admin landing
  useEffect(() => {
    if (!loading && isAuthenticated && user?.role === 'Admin') {
      navigate('/admin-landing', { replace: true })
    }
  }, [loading, isAuthenticated, user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div>
        <p className="text-3xl">
          Hello, {isAuthenticated && user ? user.full_name : 'Guest'}!
        </p>
      </div>
      <div className="mt-4">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="btn border-2 btn-xl px-8 py-2 hover:cursor-pointer hover:bg-black hover:text-white rounded-md"
          >
            LOGOUT
          </button>
        ) : (
          <Link to="/login">
            <button className="btn border-2 btn-xl px-8 py-2 hover:cursor-pointer hover:bg-black hover:text-white rounded-md">
              LOGIN
            </button>
          </Link>
        )}
      </div>
    </main>
  )
}