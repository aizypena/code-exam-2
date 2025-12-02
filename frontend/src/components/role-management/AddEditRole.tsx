import { useState, useEffect } from 'react'

interface Role {
  id: number
  role_name: string
  description: string | null
}

interface AddEditRoleProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  role: Role | null
  token: string | null
}

const API_URL = 'http://localhost:8000/api'

export default function AddEditRole({
  isOpen,
  onClose,
  onSave,
  role,
  token,
}: AddEditRoleProps) {
  const [roleName, setRoleName] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (role) {
      setRoleName(role.role_name)
      setDescription(role.description || '')
    } else {
      setRoleName('')
      setDescription('')
    }
    setFormError('')
  }, [role, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    const url = role ? `${API_URL}/roles/${role.id}` : `${API_URL}/roles`
    const method = role ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_name: roleName,
          description: description || null,
        }),
      })

      if (response.ok) {
        onSave()
        onClose()
      } else {
        const data = await response.json()
        setFormError(data.message || 'Failed to save role')
      }
    } catch (err) {
      setFormError('Failed to save role')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {role ? 'Edit Role' : 'Create Role'}
        </h2>

        {formError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 hover:cursor-pointer"
            >
              {role ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}