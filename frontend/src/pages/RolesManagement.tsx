import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AddEditRole from '../components/role-management/AddEditRole'
import ViewRole from '../components/role-management/ViewRole'
import DeleteConfirmation from '../components/DeleteConfirmation'

interface Role {
  id: number
  role_name: string
  description: string | null
}

const API_URL = 'http://localhost:8000/api'

export default function RolesManagement() {
  const { token } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  useEffect(() => {
    fetchRoles()
  }, [])

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
      } else {
        setError('Failed to fetch roles')
      }
    } catch (err) {
      setError('Failed to fetch roles')
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setSelectedRole(null)
    setIsAddEditModalOpen(true)
  }

  const openEditModal = (role: Role) => {
    setSelectedRole(role)
    setIsAddEditModalOpen(true)
  }

  const openViewModal = (role: Role) => {
    setSelectedRole(role)
    setIsViewModalOpen(true)
  }

  const openDeleteModal = (role: Role) => {
    setSelectedRole(role)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedRole) return

    try {
      const response = await fetch(`${API_URL}/roles/${selectedRole.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        await fetchRoles()
        setIsDeleteModalOpen(false)
        setSelectedRole(null)
      } else {
        setError('Failed to delete role')
      }
    } catch (err) {
      setError('Failed to delete role')
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to="/admin-landing" className="text-sm text-gray-600 hover:text-black">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-2">Role Management</h1>
          </div>
          <button
            onClick={openAddModal}
            title='Add Role'
            className="bg-black hover:cursor-pointer text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            + Add Role
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
                  Role Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No roles found
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.role_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {role.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => openViewModal(role)}
                        title='View'
                        className="text-gray-600 hover:text-gray-900 hover:cursor-pointer mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(role)}
                        title='Edit'
                        className="text-blue-600 hover:cursor-pointer hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(role)}
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
      <AddEditRole
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false)
          setSelectedRole(null)
        }}
        onSave={fetchRoles}
        role={selectedRole}
        token={token}
      />

      <ViewRole
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedRole(null)
        }}
        role={selectedRole}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedRole(null)
        }}
        onConfirm={handleDelete}
        title="Delete Role"
        itemName={selectedRole?.role_name || ''}
        itemDescription={selectedRole?.description || 'No description'}
        warningMessage="This action cannot be undone. Users assigned to this role may be affected."
      />
    </main>
  )
}