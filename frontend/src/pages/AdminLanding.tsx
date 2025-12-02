import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLanding() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Link to={'/roles-management'}>
        <button className="btn border-2 px-8 py-2 hover:cursor-pointer hover:bg-black hover:text-white rounded-md">
          Role Management
        </button>
      </Link>
      <Link to={'/users-management'}>
        <button className="btn border-2 px-8 py-2 hover:cursor-pointer hover:bg-black hover:text-white rounded-md">
          User Management
        </button>
      </Link>
      <button
        onClick={handleLogout}
        className="btn border-2 px-8 border-red-600 text-red-600 py-2 hover:cursor-pointer hover:bg-red-600 hover:text-white hover:border-red-600 rounded-md mt-4"
      >
        Logout
      </button>
    </main>
  )
}