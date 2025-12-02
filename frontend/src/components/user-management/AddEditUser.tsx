import { useState, useEffect } from 'react'

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

interface AddEditUserProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  user: User | null
  users: User[]
  roles: Role[]
  token: string | null
}

const API_URL = 'http://localhost:8000/api'

export default function AddEditUser({
  isOpen,
  onClose,
  onSave,
  user,
  users,
  roles,
  token,
}: AddEditUserProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [roleId, setRoleId] = useState<number | ''>('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setFullName(user.full_name)
      setEmail(user.email)
      setPassword('')
      setConfirmPassword('')
      setRoleId(user.role_id || '')
    } else {
      setFullName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setRoleId('')
    }
    setFormErrors({})
  }, [user, isOpen])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Check for duplicate email
    const duplicateEmail = users.find(
      (u) => u.email === email && u.id !== user?.id
    )
    if (duplicateEmail) {
      errors.email = 'Email already exists'
    }

    // Check for duplicate name
    const duplicateName = users.find(
      (u) => u.full_name === fullName && u.id !== user?.id
    )
    if (duplicateName) {
      errors.fullName = 'Full name already exists'
    }

    // Password validation (only required for new users)
    // Standard password regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!user || password) {
      if (!user && !password) {
        errors.password = 'Password is required'
      } else if (password && !passwordRegex.test(password)) {
        errors.password =
          'Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)'
      }

      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const url = user ? `${API_URL}/users/${user.id}` : `${API_URL}/users`
    const method = user ? 'PUT' : 'POST'

    const body: Record<string, unknown> = {
      full_name: fullName,
      email: email,
      role_id: roleId || null,
    }

    if (password) {
      body.password = password
      body.password_confirmation = confirmPassword
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        onSave()
        onClose()
      } else {
        const data = await response.json()
        if (data.errors) {
          setFormErrors(data.errors)
        } else {
          setFormErrors({ general: data.message || 'Failed to save user' })
        }
      }
    } catch (err) {
      setFormErrors({ general: 'Failed to save user' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {user ? 'Edit User' : 'Create User'}
        </h2>

        {formErrors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {formErrors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                formErrors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.fullName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {user ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...(!user && { required: true })}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Min 8 characters: uppercase, lowercase, number, special (@$!%*?&)
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              {...(!user && { required: true })}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Role
            </label>
            <select
              value={roleId}
              onChange={(e) =>
                setRoleId(e.target.value ? Number(e.target.value) : '')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_name}
                </option>
              ))}
            </select>
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
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
