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

interface ViewUserProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export default function ViewUser({ isOpen, onClose, user }: ViewUserProps) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">User Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">ID</label>
            <p className="text-gray-900">{user.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Full Name
            </label>
            <p className="text-gray-900">{user.full_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email Address
            </label>
            <p className="text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Role</label>
            <p className="text-gray-900">{user.role?.role_name || 'No role assigned'}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 hover:cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}