import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
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