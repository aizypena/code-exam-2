import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === 'Admin') {
        navigate('/admin-landing', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [authLoading, isAuthenticated, user, navigate])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      
      // Fetch user to check role and redirect accordingly
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
      
      if (response.ok) {
        const userData = await response.json()
        if (userData.role === 'Admin') {
          navigate('/admin-landing')
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Link to="/" className="text-sm text-gray-600 hover:text-black mb-4 inline-block">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 hover:cursor-pointer transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  )
}