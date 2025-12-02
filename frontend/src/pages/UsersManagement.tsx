import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AddEditUser from '../components/user-management/AddEditUser'
import ViewUser from '../components/user-management/ViewUser'
import DeleteConfirmation from '../components/DeleteConfirmation'

interface Role {
  id: number
  role_name: string
}

interface User {
  id: number
  full_name: string
  email: string
  role_id: number | null
  role?: Role
}

const API_URL = 'http://localhost:8000/api'

export default function UsersManagement() {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        setError('Failed to fetch users')
      }
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setRoles(data)
      }
    } catch (err) {
      console.error('Failed to fetch roles')
    }
  }

  const openAddModal = () => {
    setSelectedUser(null)
    setIsAddEditModalOpen(true)
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setIsAddEditModalOpen(true)
  }

  const openViewModal = (user: User) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        await fetchUsers()
        setIsDeleteModalOpen(false)
        setSelectedUser(null)
      } else {
        setError('Failed to delete user')
      }
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to="/admin-landing" className="text-sm text-gray-600 hover:text-black">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-2">User Management</h1>
          </div>
          <button
            onClick={openAddModal}
            title='Add User'
            className="bg-black text-white hover:cursor-pointer px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            + Add User
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role?.role_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => openViewModal(user)}
                        title='View'
                        className="text-gray-600 hover:text-gray-900 hover:cursor-pointer mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        title='Edit'
                        className="text-blue-600 hover:text-blue-900 hover:cursor-pointer mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        title='Delete'
                        className="text-red-600 hover:cursor-pointer hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddEditUser
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={fetchUsers}
        user={selectedUser}
        users={users}
        roles={roles}
        token={token}
      />

      <ViewUser
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleDelete}
        title="Delete User"
        itemName={selectedUser?.full_name || ''}
        itemDescription={selectedUser?.email || ''}
        warningMessage="This action cannot be undone."
      />
    </main>
  )
}