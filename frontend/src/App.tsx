import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import RolesManagement from './pages/RolesManagement'
import UsersManagement from './pages/UsersManagement'
import AdminLanding from './pages/AdminLanding'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/roles-management"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <RolesManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users-management"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <UsersManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-landing"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminLanding />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}